
"use client";

import { useState, useEffect } from "react";
import { Mail, Clock, Trash2, Eye, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { tempMailAPI, Email, EmailAttachment } from "./TempMailAPI";

export default function EmailInbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentEmailAddress, setCurrentEmailAddress] = useState<string>("");
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const { toast } = useToast();

  // Listen for email generation events
  useEffect(() => {
    const handleEmailGenerated = (event: CustomEvent) => {
      console.log("📥 EmailInbox received emailGenerated event:", event.detail);
      setCurrentEmailAddress(event.detail);
      setEmails([]); // Clear previous emails
      setSelectedEmail(null);
      
      // Also check localStorage for any existing emails for this address
      const savedEmails = localStorage.getItem(`fluxmail-emails-${event.detail}`);
      if (savedEmails) {
        try {
          const parsedEmails = JSON.parse(savedEmails);
          setEmails(parsedEmails);
          console.log("📧 Restored emails from localStorage:", parsedEmails);
        } catch (error) {
          console.error("❌ Error loading saved emails:", error);
        }
      }
      
      console.log("📧 Set current email address to:", event.detail);
    };

    const handleEmailExpired = () => {
      console.log("🗑️ EmailInbox received emailExpired event");
      setCurrentEmailAddress("");
      setEmails([]);
      setSelectedEmail(null);
    };

    console.log("🎧 EmailInbox: Setting up event listener for emailGenerated");
    window.addEventListener('emailGenerated', handleEmailGenerated as EventListener);
    window.addEventListener('emailExpired', handleEmailExpired);

    return () => {
      console.log("🗑️ EmailInbox: Cleaning up event listener");
      window.removeEventListener('emailGenerated', handleEmailGenerated as EventListener);
      window.removeEventListener('emailExpired', handleEmailExpired);
    };
  }, []);

  // Save emails to localStorage whenever they change
  useEffect(() => {
    if (currentEmailAddress && emails.length > 0) {
      localStorage.setItem(`fluxmail-emails-${currentEmailAddress}`, JSON.stringify(emails));
      console.log("💾 Saved emails to localStorage for:", currentEmailAddress);
    }
  }, [emails, currentEmailAddress]);

  // Auto-refresh emails every 10 seconds when we have an email address
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentEmailAddress && autoRefreshEnabled) {
      interval = setInterval(() => {
        refreshInbox();
      }, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentEmailAddress, autoRefreshEnabled]);

  const refreshInbox = async () => {
    console.log("🔄 RefreshInbox called");
    
    if (!currentEmailAddress) {
      console.log("❌ No email address set, cannot refresh inbox");
      toast({
        title: "No Email Address",
        description: "Please generate an email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsRefreshing(true);
    console.log("📤 Making API call to get messages");
    
    try {
      const messages = await tempMailAPI.getMessages();
      console.log("📬 Received messages from API:", messages);
      
      // Convert API response to our display format
      const formattedEmails: Email[] = messages.map((msg) => ({
        ...msg,
        isRead: msg.seen || false
      }));

      console.log("📋 Formatted emails:", formattedEmails);
      setEmails(formattedEmails);
      
      toast({
        title: "Inbox Refreshed",
        description: messages.length > 0 ? `Found ${messages.length} email(s)` : "No new emails",
      });
    } catch (error) {
      console.error('❌ Error refreshing inbox:', error);
      toast({
        title: "Error",
        description: "Failed to refresh inbox. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEmailClick = async (email: Email) => {
    try {
      // Load full email content
      const fullEmail = await tempMailAPI.readMessage(email.id);
      if (fullEmail) {
        setSelectedEmail(fullEmail);
        // Mark as read in local state
        setEmails(emails.map(e => 
          e.id === email.id ? { ...e, isRead: true, seen: true } : e
        ));
      }
    } catch (error) {
      console.error('Error loading email:', error);
      toast({
        title: "Error",
        description: "Failed to load email content.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(emails.filter(e => e.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
    tempMailAPI.deleteMessage(emailId).catch(error => {
      console.error('Error deleting email from server:', error);
    });
  };

  const unreadCount = emails.filter(e => !e.isRead).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Email List */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Inbox
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefreshEnabled}
                  onCheckedChange={setAutoRefreshEnabled}
                />
                <Label htmlFor="auto-refresh" className="text-sm font-ubuntu">
                  Auto Refresh
                </Label>
              </div>
              <Button
                onClick={refreshInbox}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {emails.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-ubuntu text-muted-foreground">
                {currentEmailAddress ? "No emails yet" : "Generate an email address to start"}
              </p>
              <p className="text-sm font-ubuntu text-muted-foreground mt-1">
                {currentEmailAddress ? "Emails will appear here when received" : "Click 'Generate Temporary Mail' above"}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`email-item ${!email.isRead ? 'bg-muted/30' : ''}`}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-ubuntu font-medium truncate">
                          {typeof email.from === 'string' ? email.from : email.from?.address || 'Unknown'}
                        </span>
                        {!email.isRead && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <h4 className="font-ubuntu font-medium truncate mb-1">
                        {email.subject}
                      </h4>
                      <p className="text-sm font-ubuntu text-muted-foreground truncate">
                        {tempMailAPI.formatDate(email.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs font-ubuntu text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tempMailAPI.formatDate(email.createdAt)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEmail(email.id);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Content */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-lato">
            <Eye className="h-5 w-5" />
            Email Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedEmail ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-lato font-semibold mb-2">{selectedEmail.subject}</h3>
                <div className="flex items-center justify-between text-sm font-ubuntu text-muted-foreground">
                  <span className="truncate">From: {typeof selectedEmail.from === 'string' ? selectedEmail.from : selectedEmail.from?.address || 'Unknown'}</span>
                  <span className="whitespace-nowrap ml-2">{tempMailAPI.formatDate(selectedEmail.createdAt)}</span>
                </div>
              </div>
              <div className="max-h-[50vh] overflow-y-auto email-content-body">
                {selectedEmail.html && selectedEmail.html.length > 0 ? (
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert font-ubuntu"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedEmail.html[0].replace(
                        /<a\s+(?![^>]*\btarget\b)/gi, 
                        '<a target="_blank" rel="noopener noreferrer" '
                      )
                    }} 
                  />
                ) : (
                  <pre className="font-ubuntu whitespace-pre-wrap break-words">
                    {selectedEmail.text || "No content available"}
                  </pre>
                )}
              </div>
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-ubuntu font-medium mb-2">Attachments:</h4>
                  <div className="space-y-2">
                    {selectedEmail.attachments.map((attachment: EmailAttachment, index: number) => (
                      <div key={index} className="text-sm font-ubuntu text-muted-foreground">
                        📎 {attachment.filename} ({attachment.size} bytes)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="font-ubuntu text-muted-foreground">Select an email to view its content</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
