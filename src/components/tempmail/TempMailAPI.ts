// Temporary email API integration with automatic provider failover.
// Primary: Guerrilla Mail (https://www.guerrillamail.com) - free, no API key,
//          browser-friendly (sends Access-Control-Allow-Origin: *) and unlimited.
// Fallback: 1secmail (https://www.1secmail.com) - free, no API key.
// Note: Mail.tm was removed because it does not send Access-Control-Allow-Origin
//       for third-party origins, so it is unusable directly from the browser.

const GUERRILLA_BASE_URL = 'https://api.guerrillamail.com/ajax.php';
const ONE_SECMAIL_BASE_URL = 'https://www.1secmail.com/api/v1/';

const GUERRILLA_BLOCKED_DOMAINS = [
  'guerrillamailblock.com',
  'guerrillamail.biz',
];

export interface EmailAttachment {
  filename: string;
  size?: number;
  contentType?: string;
}

export interface Email {
  id: string;
  from: {
    name: string;
    address: string;
  };
  subject: string;
  createdAt: string;
  intro?: string;
  text?: string;
  html?: string[];
  seen?: boolean;
  hasAttachments?: boolean;
  attachments?: EmailAttachment[];
  isRead?: boolean; // For local state management
}

export interface Account {
  id: string;
  address: string;
  token?: string;
  provider?: string;
}

interface MailProvider {
  readonly name: string;
  generateAddress(): Promise<GeneratedAddress>;
  getMessages(account: Account): Promise<Email[]>;
  readMessage(account: Account, messageId: string): Promise<Email | null>;
  deleteMessage?(account: Account, messageId: string): Promise<boolean>;
}

interface GeneratedAddress {
  address: string;
  account: Account;
}

interface GuerrillaAddressResponse {
  email_addr?: string;
  sid_token?: string;
}

interface GuerrillaAuth {
  success?: boolean;
  error_codes?: unknown[];
}

interface GuerrillaMessage {
  mail_id?: number | string;
  mail_from?: string;
  mail_subject?: string;
  mail_excerpt?: string;
  mail_date?: string;
  mail_timestamp?: number | string;
  mail_read?: number | string;
  att?: number | string;
  content_type?: string;
  size?: number | string;
  mail_body?: string;
  mail_filename?: string;
  ref_mid?: string;
}

interface GuerrillaResponse extends GuerrillaMessage {
  error?: string;
  auth?: GuerrillaAuth;
  list?: GuerrillaMessage[];
}

interface OneSecMessage {
  id?: number | string;
  from?: string;
  date?: string;
  subject?: string;
  body?: string;
  textBody?: string;
  htmlBody?: string;
  unread?: boolean | string;
  read?: boolean | string;
  attachments?: {
    filename?: string;
    contentType?: string;
    size?: number;
  }[];
}

async function fetchJson<T>(url: string, timeoutMs = 20000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } finally {
    clearTimeout(timer);
  }
}

function extractSender(from: string): { name: string; address: string } {
  const match = /^(?:"?([^"<]*)"?\s*)?<?([^<\s>@]+@[^>\s]+)>?$/i.exec(
    (from || '').trim()
  );
  if (match) {
    return {
      name: match[1] ? match[1].trim() : match[2],
      address: match[2],
    };
  }
  return { name: 'Unknown', address: from || 'Unknown' };
}

function parseGuerrillaDate(
  timestamp: number | string | undefined,
  dateString: string | undefined
): string {
  const ts = Number(timestamp || 0);
  if (ts > 0) {
    return new Date(ts * 1000).toISOString();
  }

  const raw = (dateString || '').trim();
  if (!raw) {
    return new Date().toISOString();
  }

  // Time-only format (e.g. "18:42:10") - assume today, UTC.
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) {
    const [h, m, s] = raw.split(':').map(Number);
    const today = new Date();
    today.setUTCHours(h, m, s, 0);
    return today.toISOString();
  }

  const parsed = new Date(raw.replace(' ', 'T'));
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

function isUsableGuerrillaDomain(address: string): boolean {
  const domain = address.split('@')[1] || '';
  return !GUERRILLA_BLOCKED_DOMAINS.includes(domain.toLowerCase());
}

class GuerrillaMailProvider implements MailProvider {
  readonly name = 'guerrilla';

  async generateAddress(): Promise<GeneratedAddress> {
    const emailJson = await fetchJson<GuerrillaAddressResponse>(
      `${GUERRILLA_BASE_URL}?f=get_email_address&lang=en`
    );

    if (!emailJson.email_addr || !emailJson.sid_token) {
      throw new Error('Guerrilla Mail did not return an email address.');
    }

    let address: string = emailJson.email_addr;
    let sidToken: string = emailJson.sid_token;

    // Try up to 3 times to get an address on a non-blocked domain so it can be
    // accepted by more signup forms. Falls back to whatever is returned.
    if (!isUsableGuerrillaDomain(address)) {
      for (let i = 0; i < 3; i++) {
        const nextJson = await fetchJson<GuerrillaAddressResponse>(
          `${GUERRILLA_BASE_URL}?f=get_email_address&lang=en`
        );
        if (
          nextJson.email_addr &&
          nextJson.sid_token &&
          isUsableGuerrillaDomain(nextJson.email_addr)
        ) {
          address = nextJson.email_addr;
          sidToken = nextJson.sid_token;
          break;
        }
      }
    }

    const account: Account = {
      id: address,
      address,
      token: sidToken,
      provider: this.name,
    };

    return { address, account };
  }

  private async request(
    f: string,
    params: Record<string, string | number>,
    account: Account
  ): Promise<GuerrillaResponse> {
    const query = new URLSearchParams({
      lang: 'en',
      sid_token: account.token || '',
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ),
    });
    const json = await fetchJson<GuerrillaResponse>(
      `${GUERRILLA_BASE_URL}?f=${f}&${query.toString()}`
    );

    if (json.auth && json.auth.success === false) {
      throw new Error(json.error || 'Guerrilla Mail request failed.');
    }
    if (json.error) {
      throw new Error(json.error);
    }
    return json;
  }

  async getMessages(account: Account): Promise<Email[]> {
    const json = await this.request(
      'get_email_list',
      { seq: 0, offset: 0 },
      account
    );
    const list: GuerrillaMessage[] = Array.isArray(json.list) ? json.list : [];
    return list.map((msg) => this.normalizeMessage(msg));
  }

  async readMessage(account: Account, messageId: string): Promise<Email | null> {
    const json = await this.request('fetch_email', { email_id: messageId }, account);
    if (!json.mail_id) return null;
    return this.normalizeMessage(json, true);
  }

  async deleteMessage(account: Account, messageId: string): Promise<boolean> {
    await this.request(
      'forget_email',
      { email_id: messageId, email_addr: account.id },
      account
    );
    return true;
  }

  private normalizeMessage(msg: GuerrillaMessage, full = false): Email {
    const sender = extractSender(msg.mail_from || 'Unknown');

    const createdAtIso = parseGuerrillaDate(
      msg.mail_timestamp,
      msg.mail_date
    );

    const body = typeof msg.mail_body === 'string' ? msg.mail_body : '';
    const hasAttachments = Number(msg.att || 0) > 0;
    const isRead = msg.mail_read === 1 || msg.mail_read === '1';

    const email: Email = {
      id: String(msg.mail_id),
      from: sender,
      subject: msg.mail_subject || '(no subject)',
      createdAt: createdAtIso,
      intro: msg.mail_excerpt || '',
      text: this.stripHtml(body),
      html: body ? [body] : [],
      seen: isRead,
      hasAttachments,
      attachments: hasAttachments
        ? [{ filename: msg.mail_filename || 'attachment' }]
        : [],
      isRead,
    };

    if (full) {
      email.text = this.stripHtml(body);
      email.html = body ? [body] : [];
    }

    return email;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\r/g, '')
      .trim();
  }
}

class OneSecMailProvider implements MailProvider {
  readonly name = '1secmail';

  async generateAddress(): Promise<GeneratedAddress> {
    const json = await fetchJson<string[]>(
      `${ONE_SECMAIL_BASE_URL}?action=genRandomMailbox&count=1`
    );
    const address = Array.isArray(json) && json[0] ? String(json[0]) : '';

    if (!address) {
      throw new Error('1secmail did not return an email address.');
    }

    const account: Account = {
      id: address,
      address,
      token: '',
      provider: this.name,
    };

    return { address, account };
  }

  private parseAddress(account: Account): { login: string; domain: string } {
    const parts = account.address.split('@');
    if (parts.length !== 2) {
      throw new Error(`Invalid email address: ${account.address}`);
    }
    return { login: parts[0], domain: parts[1] };
  }

  async getMessages(account: Account): Promise<Email[]> {
    const { login, domain } = this.parseAddress(account);
    const json = await fetchJson<OneSecMessage[]>(
      `${ONE_SECMAIL_BASE_URL}?action=inbox&login=${encodeURIComponent(
        login
      )}&domain=${encodeURIComponent(domain)}&ts=${Date.now()}`
    );
    const list: OneSecMessage[] = Array.isArray(json) ? json : [];
    return list.map((msg) => this.normalizeMessage(msg));
  }

  async readMessage(account: Account, messageId: string): Promise<Email | null> {
    const { login, domain } = this.parseAddress(account);
    const json = await fetchJson<OneSecMessage>(
      `${ONE_SECMAIL_BASE_URL}?action=readMessage&login=${encodeURIComponent(
        login
      )}&domain=${encodeURIComponent(domain)}&id=${encodeURIComponent(messageId)}`
    );
    if (!json || !json.id) return null;
    return this.normalizeMessage(json, true);
  }

  private normalizeMessage(msg: OneSecMessage, full = false): Email {
    const sender = extractSender(msg.from || 'Unknown');

    let createdAtIso: string;
    const parsed = new Date(String(msg.date || '').replace(' ', 'T') + 'Z');
    if (!isNaN(parsed.getTime())) {
      createdAtIso = parsed.toISOString();
    } else {
      createdAtIso = new Date().toISOString();
    }

    const htmlBody = typeof msg.htmlBody === 'string' ? msg.htmlBody : '';
    const textBody =
      typeof msg.textBody === 'string'
        ? msg.textBody
        : typeof msg.body === 'string'
        ? msg.body
        : '';

    const attachments: EmailAttachment[] = Array.isArray(msg.attachments)
      ? msg.attachments.map((att) => ({
          filename: att.filename || 'attachment',
          size: att.size || 0,
          contentType: att.contentType || 'application/octet-stream',
        }))
      : [];

    const isRead = full ? true : Boolean(msg.unread === false || msg.read);

    return {
      id: String(msg.id),
      from: sender,
      subject: msg.subject || '(no subject)',
      createdAt: createdAtIso,
      intro: textBody.slice(0, 160),
      text: textBody,
      html: htmlBody ? [htmlBody] : [],
      seen: isRead,
      hasAttachments: attachments.length > 0,
      attachments,
      isRead,
    };
  }
}

class TempMailAPI {
  private providers: MailProvider[] = [
    new GuerrillaMailProvider(),
    new OneSecMailProvider(),
  ];

  private currentAccount: Account | null = null;

  private readonly recoveryStorageKey = 'fluxmail-recovery-records';

  private getRecoveryRecords(): Record<
    string,
    { account: Account; address: string; createdAt: number }
  > {
    try {
      const raw = localStorage.getItem(this.recoveryStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.error('Error loading recovery records:', error);
      return {};
    }
  }

  private getProvider(name?: string): MailProvider {
    const target =
      name || this.currentAccount?.provider || this.providers[0].name;
    return this.providers.find((p) => p.name === target) || this.providers[0];
  }

  async generateRandomEmail(): Promise<string> {
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      try {
        const { address, account } = await provider.generateAddress();
        this.currentAccount = account;
        console.log(`✅ Email created via ${provider.name}:`, address);
        return address;
      } catch (error) {
        lastError =
          error instanceof Error ? error : new Error(String(error));
        console.warn(`⚠️  Provider "${provider.name}" failed:`, lastError.message);
      }
    }

    throw (
      lastError ||
      new Error('All email providers are currently unavailable.')
    );
  }

  async getMessages(): Promise<Email[]> {
    if (!this.currentAccount) {
      return [];
    }

    const provider = this.getProvider(this.currentAccount.provider);
    try {
      const messages = await provider.getMessages(this.currentAccount);
      return messages.map((msg) => ({
        ...msg,
        isRead: msg.seen || msg.isRead || false,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async readMessage(messageId: string): Promise<Email | null> {
    if (!this.currentAccount) {
      return null;
    }

    const provider = this.getProvider(this.currentAccount.provider);
    try {
      return await provider.readMessage(this.currentAccount, messageId);
    } catch (error) {
      console.error('Error reading message:', error);
      return null;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    if (!this.currentAccount) {
      return false;
    }

    const provider = this.getProvider(this.currentAccount.provider);
    if (!provider.deleteMessage) {
      return false;
    }

    try {
      return await provider.deleteMessage(this.currentAccount, messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  getProviderName(): string {
    return this.currentAccount?.provider || this.providers[0].name;
  }

  isValidAccount(account: Account | null | undefined): boolean {
    return Boolean(
      account &&
        account.address &&
        (account.provider === 'guerrilla' || account.provider === '1secmail')
    );
  }

  generateRecoveryId(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    const records = this.getRecoveryRecords();
    let id = '';
    do {
      let body = '';
      for (let i = 0; i < 8; i++) {
        body += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      id = `FLUX-${body.slice(0, 4)}-${body.slice(4)}`;
    } while (records[id]);
    return id;
  }

  saveRecoveryAccount(id: string, account: Account): void {
    const records = this.getRecoveryRecords();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // keep recovery records for 24 hours

    const prunedEntries = Object.entries(records)
      .filter(([, rec]) => now - rec.createdAt < maxAge)
      .slice(-49);

    const pruned: Record<string, { account: Account; address: string; createdAt: number }> = {};
    for (const [key, rec] of prunedEntries) {
      pruned[key] = rec;
    }

    pruned[id] = {
      account,
      address: account.address,
      createdAt: now,
    };

    try {
      localStorage.setItem(this.recoveryStorageKey, JSON.stringify(pruned));
    } catch (error) {
      console.error('Error saving recovery record:', error);
    }
  }

  recoverAccount(id: string): Account | null {
    const normalized = (id || '').trim().toUpperCase();
    if (!normalized) return null;

    const records = this.getRecoveryRecords();
    const record = records[normalized];
    if (!record || !this.isValidAccount(record.account)) {
      return null;
    }

    this.currentAccount = record.account;
    return record.account;
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  }

  getCurrentAccount(): Account | null {
    return this.currentAccount;
  }

  setCurrentAccount(account: Account): void {
    this.currentAccount = account;
  }
}

export const tempMailAPI = new TempMailAPI();