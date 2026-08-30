# 📧 FluxMail - Temporary Mail Service

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4.19-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</div>

<div align="center">
  <h3>🚀 Professional Temporary Email Service</h3>
  <p><em>Generate temporary disposable email addresses and recover them after expiry - all in one modern web application</em></p>
  
  <p>
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#api-integration">API Integration</a> •
    <a href="#deployment">Deployment</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## 🌟 Features Overview

### 📧 **Temporary Mail Generator**
- **🔄 Instant Email Creation**: Generate temporary email addresses in seconds using the Guerrilla Mail API
- **🔀 Multi-Provider Failover**: Automatically falls back to 1secmail if the primary API is unavailable
- **⏰ Auto-Expiry Management**: 10-minute default with 24-hour extension option
- **📬 Real-time Inbox**: Live email monitoring with auto-refresh every 10 seconds
- **💾 Persistent Storage**: Emails saved locally with expiration tracking
- **📋 Copy to Clipboard**: One-click copying of email addresses
- **📱 Mobile Responsive**: Optimized for all device sizes

### 🔐 **Email Recovery**
- **🔑 Unique Recovery ID**: Every mailbox gets its own recovery ID (e.g. `FLUX-ABCD-1234`)
- **⏪ Get Your Mail Back**: Re-enter an expired mailbox's ID to reactivate the same address for another 10 minutes
- **📋 Copy Recovery ID**: One-click copy so you never lose access
- **💾 Automatic Records**: Recovery IDs are saved locally and pruned after 24 hours

### 🎨 **Modern UI/UX**
- **🎭 shadcn/ui Components**: Beautiful, accessible UI components (49 components)
- **🌓 Theme Support**: Built-in dark/light theme compatibility
- **📱 Responsive Design**: Mobile-first responsive layout
- **✨ Smooth Animations**: CSS animations and transitions
- **🔔 Toast Notifications**: Real-time feedback system
- **🎯 Clean Interface**: Intuitive and professional design

### 📄 **Additional Pages**
- **❓ FAQ**: Comprehensive frequently asked questions
- **⭐ Features**: Detailed feature showcase and capabilities
- **🔒 Privacy Policy**: Complete privacy information and data handling
- **📜 Terms of Service**: Legal terms and conditions
- **❌ 404 Error Page**: Custom not found page with navigation

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/gitchking/FluxMail-TemperaryMailService.git

# Navigate to project directory
cd FluxMail-TemperaryMailService

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint
```

---

## 🏗️ Project Architecture

### 📁 Directory Structure
```
FluxMail-TemperaryMailService/
├── 📂 public/                 # Static assets
│   ├── favicon.ico
│   ├── favicon.png
│   ├── placeholder.svg
│   └── robots.txt
├── 📂 src/
│   ├── 📂 components/         # Reusable components
│   │   ├── 📂 layout/         # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── 📂 sms/            # SMS components
│   │   │   └── SMSBomber.tsx
│   │   ├── 📂 tempmail/       # Email functionality
│   │   │   ├── EmailGenerator.tsx
│   │   │   ├── EmailInbox.tsx
│   │   │   └── TempMailAPI.ts
│   │   └── 📂 ui/             # shadcn/ui components (48 components)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ... (44 more components)
│   ├── 📂 hooks/             # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── 📂 lib/               # Utility functions
│   │   └── utils.ts
│   ├── 📂 pages/             # Application pages
│   │   ├── Index.tsx         # Home page
│   │   ├── FAQ.tsx           # FAQ page
│   │   ├── Features.tsx      # Features page
│   │   ├── Privacy.tsx       # Privacy policy
│   │   ├── Terms.tsx         # Terms of service
│   │   └── NotFound.tsx      # 404 error page
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # App entry point
│   ├── index.css             # Global styles
│   └── vite-env.d.ts         # Vite type definitions
├── 📄 package.json           # Dependencies and scripts
├── 📄 tailwind.config.ts     # Tailwind configuration
├── 📄 vite.config.ts         # Vite configuration
├── 📄 tsconfig.json          # TypeScript configuration
└── 📄 README.md              # Project documentation
```

### 🛠️ Technology Stack

#### **Frontend Framework**
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.8.3** - Type-safe JavaScript with enhanced developer experience
- **Vite 5.4.19** - Next-generation frontend build tool for fast development

#### **UI & Styling**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible React components (49 components)
- **Lucide React 0.462.0** - Beautiful SVG icon library
- **Radix UI** - Low-level UI primitives for accessibility
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS class utilities

#### **State Management & Data**
- **TanStack Query 5.83.0** - Powerful data synchronization and caching
- **React Hook Form 7.61.1** - Performant forms with validation
- **Zod 3.25.76** - TypeScript-first schema validation
- **date-fns 3.6.0** - Modern JavaScript date utility library

#### **UI Components & Interactions**
- **Embla Carousel React 8.6.0** - Carousel/slider components
- **Recharts 2.15.4** - Composable charting library
- **React Day Picker 8.10.1** - Date picker component
- **React Resizable Panels 2.1.9** - Resizable panel layouts
- **Sonner 1.7.4** - Toast notification system
- **Vaul 0.9.9** - Drawer/modal components

#### **Routing & Navigation**
- **React Router DOM 6.30.1** - Declarative routing for React
- **React Helmet 6.1.0** - Document head management

#### **Development Tools**
- **ESLint 9.32.0** - Code linting and formatting
- **TypeScript ESLint 8.38.0** - TypeScript-specific linting rules
- **PostCSS 8.5.6** - CSS processing and optimization
- **Autoprefixer 10.4.21** - CSS vendor prefixing

---

## 🌐 API Integration

### Guerrilla Mail API (Primary)

FluxMail integrates with **Guerrilla Mail**, a free and reliable temporary email service that works directly from the browser:

- **Base URL**: `https://api.guerrillamail.com/ajax.php`
- **Authentication**: Session token based (`sid_token`)
- **CORS**: Open (`Access-Control-Allow-Origin: *`) - works from any origin
- **Rate Limiting**: No API key or signup required; effectively unlimited
- **Error Handling**: Comprehensive error management with automatic provider failover

#### Key API Endpoints:
```text
// Get a new random email address (creates a session)
GET /ajax.php?f=get_email_address&lang=en

// List messages in the inbox
GET /ajax.php?f=get_email_list&seq=0&offset=0&lang=en&sid_token={token}

// Read a specific message
GET /ajax.php?f=fetch_email&email_id={id}&lang=en&sid_token={token}

// Delete a message
GET /ajax.php?f=forget_email&email_id={id}&email_addr={address}&lang=en&sid_token={token}
```

#### Features:
- **No Account Setup**: Mailboxes are created on the fly - no passwords, no registration
- **Session Based**: Responses include a `sid_token` persisted to local storage
- **Bulk Usernames**: Random usernames chosen server-side; blocked domains are retried automatically
- **Real-time Updates**: Periodic message checking

### 1secmail API (Fallback)

If Guerrilla Mail is unreachable, FluxMail automatically falls back to **1secmail**:

- **Base URL**: `https://www.1secmail.com/api/v1/`
- **Authentication**: None required (random mailbox only)
- **CORS**: Browser accessible

```text
// Generate a random mailbox
GET /api/v1/?action=genRandomMailbox&count=1

// Get inbox
GET /api/v1/?action=inbox&login={user}&domain={domain}

// Read a message
GET /api/v1/?action=readMessage&login={user}&domain={domain}&id={id}
```

### Why not Mail.tm?

The previous integration used **Mail.tm** (`https://api.mail.tm`), but that API does not send
`Access-Control-Allow-Origin` headers for third-party origins - it only whitelists its own
`app.mail.tm` domain. Browser requests from FluxMail therefore fail with CORS errors and the
API cannot be reached client-side without a proxy server. Guerrilla Mail and 1secmail both
support open CORS, making them suitable for a fully client-side app.

---

## 🎯 Core Components

### EmailGenerator Component

**Location**: `src/components/tempmail/EmailGenerator.tsx`

**Features**:
- 📧 Generates temporary email addresses using Guerrilla Mail (1secmail fallback) API
- ⏰ Manages email expiration (10 min default, 24h extended)
- 💾 Local storage persistence with automatic cleanup
- ⏱️ Real-time countdown timer with visual feedback
- 📋 Copy to clipboard functionality with success feedback
- 🔄 Loading states and error handling
- 📱 Responsive design with mobile optimization

**Key Methods**:
```typescript
// Generate new email
const generateEmail = async () => {
  // Guerrilla Mail / 1secmail integration with automatic failover
}

// Extend email duration
const extendEmail = () => {
  setExpiresIn(86400); // 24 hours
}

// Copy to clipboard
const copyToClipboard = async () => {
  await navigator.clipboard.writeText(currentEmail);
}
```

### EmailInbox Component

**Location**: `src/components/tempmail/EmailInbox.tsx`

**Features**:
- 📬 Real-time email monitoring with auto-refresh
- 📝 Message threading and detailed viewing
- 🔄 Auto-refresh every 10 seconds
- 👁️ Mark as read/unread functionality
- 🌐 Email content display (HTML and text)
- 📱 Mobile-responsive inbox interface
- 🔔 Toast notifications for new emails

### Email Recovery

**Location**: `src/components/tempmail/EmailGenerator.tsx` + `src/components/tempmail/TempMailAPI.ts`

**Features**:
- 🔑 Unique recovery ID generated for every mailbox (e.g. `FLUX-XXXX-XXXX`)
- 📋 Copy recovery ID to clipboard for later use
- ⏪ Restore an expired mailbox by entering its ID (invalid IDs are rejected with a clear message)
- ⏰ Reactivated mailboxes get another 10 minutes
- 💾 Recovery records stored locally (`fluxmail-recovery-records`) and pruned after 24 hours

**Key Flow**:
```typescript
// Generate a recovery ID for a new mailbox
const recoveryId = tempMailAPI.generateRecoveryId();
tempMailAPI.saveRecoveryAccount(recoveryId, tempMailAPI.getCurrentAccount());

// Recover an expired mailbox by ID
const account = tempMailAPI.recoverAccount("FLUX-XXXX-XXXX");
```

### TempMailAPI Service

**Location**: `src/components/tempmail/TempMailAPI.ts`

**Features**:
- 🌐 Multi-provider email API integration (Guerrilla Mail + 1secmail fallback)
- 🔄 Automatic provider failover for resilience
- 🔑 Session-based token management
- 📧 Email account creation and management
- 📬 Message retrieval and processing
- 🗑️ Server-side message deletion
- 🔐 Recovery ID generation, storage, and restoration
- ⚠️ Comprehensive error handling

---

## 🔒 Security & Privacy

### Data Handling
- **🚫 No Server Storage**: All data stored locally in browser only
- **⏰ Temporary Nature**: Emails expire automatically (10 min/24 hr)
- **🚫 No Personal Information**: No registration or personal data required
- **💻 Client-Side Only**: All operations performed in browser
- **🧹 Auto-Cleanup**: Expired data automatically removed from local storage

### Test Data Only
- **📧 Email Addresses**: Temporary and disposable, automatically expire (recoverable by ID for a further 10 minutes)
- **🚫 No Personal Data**: No real personal information is used or stored
- **⚠️ Disclaimer**: Clear warnings about the temporary nature of generated data

### API Security
- **🔐 HTTPS Only**: All API communications use secure HTTPS
- **🎫 Token-Based Auth**: Secure bearer token authentication
- **🔄 Automatic Cleanup**: Tokens and accounts automatically expire
- **🚫 No Sensitive Data**: No storage of passwords or sensitive information

---

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

#### **Vercel** (Recommended) ⭐
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Advantages**:
- ✅ Automatic deployments from GitHub
- ✅ Built-in SPA routing support
- ✅ Edge functions and CDN
- ✅ Custom domains and SSL

#### **Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Advantages**:
- ✅ Drag-and-drop deployment
- ✅ Built-in form handling
- ✅ Automatic HTTPS
- ✅ Branch previews

#### **GitHub Pages**
```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run build && npm run deploy
```

**Note**: Limited SPA routing support. Consider using Vercel or Netlify for full functionality.

#### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Test** your changes thoroughly
6. **Commit** your changes (`git commit -m '✨ Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Development Guidelines

#### Code Style
- ✅ **TypeScript**: Use strict TypeScript with proper type definitions
- ✅ **ESLint**: Follow the existing ESLint configuration
- ✅ **Components**: Use functional components with hooks
- ✅ **Naming**: Use descriptive, meaningful names for variables and functions
- ✅ **Comments**: Write comprehensive JSDoc comments for functions
- ✅ **Imports**: Use absolute imports with `@/` prefix

#### Component Guidelines
- ✅ **shadcn/ui**: Prefer shadcn/ui components over custom ones
- ✅ **Responsive**: Ensure all components work on mobile devices
- ✅ **Accessibility**: Follow WCAG guidelines for accessibility
- ✅ **Performance**: Optimize for performance with React.memo when needed
- ✅ **Error Handling**: Include proper error boundaries and handling

#### Git Commit Convention
Follow the emoji-based commit convention:

- ✨ `:sparkles:` - New features
- 🔧 `:wrench:` - Bug fixes
- 📝 `:memo:` - Documentation
- 🎨 `:art:` - UI/UX improvements
- ⚡ `:zap:` - Performance improvements
- 🔒 `:lock:` - Security updates
- 🚀 `:rocket:` - Deployment and releases

### Testing

```bash
# Run linting
npm run lint

# Build and test
npm run build
npm run preview
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ❌ **Liability** not provided
- ❌ **Warranty** not provided

---

## 🆘 Support & Troubleshooting

### Common Issues

#### **📧 Email Generation Fails**
**Symptoms**: Error messages when generating emails
**Solutions**:
- ✅ Check internet connection
- ✅ Check browser console for detailed error messages
- ✅ Clear browser cache and localStorage
- ✅ Try refreshing the page
- ✅ If both APIs are unreachable, wait a moment and retry (transient rate limits)

#### **🔑 Recovery ID Not Working**
**Symptoms**: Entering a recovery ID says it's invalid
**Solutions**:
- ✅ Make sure the ID belongs to a mailbox generated on this browser (records are stored locally)
- ✅ Check the ID is formatted like `FLUX-XXXX-XXXX`
- ✅ Recovery records expire automatically after 24 hours
- ✅ The provider may have already recycled the address - generate a new mailbox in that case

#### **🎨 UI Components Not Loading**
**Symptoms**: Missing styles or broken layout
**Solutions**:
- ✅ Ensure all dependencies are installed (`npm install`)
- ✅ Check for TypeScript errors (`npm run lint`)
- ✅ Verify Node.js version compatibility (v18+)
- ✅ Clear node_modules and reinstall dependencies
- ✅ Check for conflicting CSS or browser extensions

#### **🔄 SPA Routing Issues (404 errors)**
**Symptoms**: 404 errors when refreshing pages
**Solutions**:
- ✅ Configure your hosting platform for SPA routing
- ✅ Use the provided configuration files (vercel.json, _redirects)
- ✅ Check server configuration for fallback to index.html

### Getting Help

- 🐛 **Bug Reports**: [Open an issue on GitHub](https://github.com/gitchking/FluxMail-TemperaryMailService/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/gitchking/FluxMail-TemperaryMailService/discussions)
- 📧 **General Questions**: Use GitHub Discussions
- 📖 **Documentation**: Check this README and code comments

### Performance Tips

- 🚀 **Fast Loading**: Enable browser caching for static assets
- 📱 **Mobile Performance**: Test on actual mobile devices
- 🔄 **Email Refresh**: Adjust refresh interval based on needs
- 💾 **Storage Management**: Clear old data periodically

---

## 🙏 Acknowledgments

### APIs & Services
- **[Guerrilla Mail](https://www.guerrillamail.com)** - For providing free, reliable temporary email API
- **[1secmail](https://www.1secmail.com)** - Fallback temporary email API

### UI & Design
- **[shadcn/ui](https://ui.shadcn.com)** - For beautiful, accessible UI components
- **[Tailwind CSS](https://tailwindcss.com)** - For utility-first styling framework
- **[Radix UI](https://radix-ui.com)** - For accessible, unstyled UI primitives
- **[Lucide](https://lucide.dev)** - For beautiful, consistent icons

### Development Tools
- **[Vite](https://vitejs.dev)** - For lightning-fast build tool
- **[React](https://react.dev)** - For the amazing component-based framework
- **[TypeScript](https://typescriptlang.org)** - For type-safe development
- **[TanStack Query](https://tanstack.com/query)** - For powerful data synchronization

### Inspiration
- **Open Source Community** - For countless examples and contributions
- **Modern Web Development** - For pushing the boundaries of what's possible

---

<div align="center">
  <h3>⭐ If you found this project helpful, please give it a star! ⭐</h3>
  <p>
    <strong>Made with ❤️ by the FluxMail Team</strong><br>
    <em>Empowering developers with modern, accessible tools</em>
  </p>
  
  <p>
    <a href="https://github.com/gitchking/FluxMail-TemperaryMailService">🌟 Star on GitHub</a> •
    <a href="https://github.com/gitchking/FluxMail-TemperaryMailService/issues">🐛 Report Bug</a> •
    <a href="https://github.com/gitchking/FluxMail-TemperaryMailService/discussions">💡 Request Feature</a>
  </p>
</div>
