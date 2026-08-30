
"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Copy, Clock, CheckCircle, Calendar, KeyRound, Undo2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { tempMailAPI, Account } from "./TempMailAPI";

interface StoredEmailData {
  email: string;
  expiresAt: number;
  isExtended: boolean;
  account: Account;
  recoveryId?: string;
}

export default function EmailGenerator() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiresIn, setExpiresIn] = useState(600); // 10 minutes in seconds
  const [isExtended, setIsExtended] = useState(false);
  const [recoveryId, setRecoveryId] = useState("");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [showRecoveryId, setShowRecoveryId] = useState(false);
  const [showRecoverForm, setShowRecoverForm] = useState(false);
  const { toast } = useToast();

  // Load saved email from localStorage on component mount
  useEffect(() => {
    const savedEmailData = localStorage.getItem('fluxmail-current-email');
    if (savedEmailData) {
      try {
        const data: StoredEmailData = JSON.parse(savedEmailData);
        const now = Date.now();
        
        // Check if email hasn't expired and the account is still usable
        if (data.expiresAt > now && tempMailAPI.isValidAccount(data.account)) {
          setCurrentEmail(data.email);
          setIsExtended(data.isExtended);
          setExpiresIn(Math.floor((data.expiresAt - now) / 1000));
          
          // Restore the account in tempMailAPI
          tempMailAPI.setCurrentAccount(data.account);

          // Restore (or create) the recovery ID for this mailbox
          const restoredId = data.recoveryId || tempMailAPI.generateRecoveryId();
          setRecoveryId(restoredId);
          tempMailAPI.saveRecoveryAccount(restoredId, data.account);
          
          // Dispatch event for inbox
          window.dispatchEvent(new CustomEvent('emailGenerated', { detail: data.email }));
          
          console.log("📧 Restored email from localStorage:", data.email);
        } else {
          // Email has expired, clear storage
          localStorage.removeItem('fluxmail-current-email');
          setRecoveryInput(data.recoveryId || "");
          console.log("⏰ Stored email has expired, cleared from storage");
        }
      } catch (error) {
        console.error("❌ Error loading saved email:", error);
        localStorage.removeItem('fluxmail-current-email');
      }
    }
  }, []);

  // Save email data to localStorage whenever it changes
  useEffect(() => {
    if (currentEmail && expiresIn > 0) {
      const expiresAt = Date.now() + (expiresIn * 1000);
      const emailData: StoredEmailData = {
        email: currentEmail,
        expiresAt,
        isExtended,
        account: tempMailAPI.getCurrentAccount(),
        recoveryId
      };
      
      localStorage.setItem('fluxmail-current-email', JSON.stringify(emailData));
      console.log("💾 Saved email to localStorage:", currentEmail);
    } else if (expiresIn <= 0) {
      // Email expired, remove from storage
      localStorage.removeItem('fluxmail-current-email');
      console.log("🗑️ Removed expired email from localStorage");
    }
  }, [currentEmail, expiresIn, isExtended, recoveryId]);
  // Pass current email to parent component for inbox
  useEffect(() => {
    if (currentEmail) {
      window.dispatchEvent(new CustomEvent('emailGenerated', { detail: currentEmail }));
    }
  }, [currentEmail]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentEmail && expiresIn > 0) {
      interval = setInterval(() => {
        setExpiresIn(prev => {
          if (prev <= 1) {
            setCurrentEmail("");
            setIsExtended(false);
            localStorage.removeItem('fluxmail-current-email');
            setRecoveryInput(recoveryId);
            setShowRecoverForm(true);
            window.dispatchEvent(new CustomEvent('emailExpired'));
            toast({
              title: "Email Expired",
              description: "Your temporary email has expired",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentEmail, expiresIn, recoveryId, toast]);

  const generateEmail = async () => {
    console.log("🔄 Starting email generation...");
    setIsGenerating(true);
    
    // Show initial toast message
    toast({
      title: "Generating Email",
      description: "Please wait, creating your temporary email...",
    });
    
    try {
      console.log("📧 Calling tempMailAPI.generateRandomEmail()...");
      
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newEmail = await tempMailAPI.generateRandomEmail();
      console.log("✅ Generated email:", newEmail);

      // Create and persist a recovery ID for this mailbox
      const newRecoveryId = tempMailAPI.generateRecoveryId();
      tempMailAPI.saveRecoveryAccount(newRecoveryId, tempMailAPI.getCurrentAccount());

      setCurrentEmail(newEmail);
      setExpiresIn(600); // 10 minutes
      setIsExtended(false);
      setRecoveryId(newRecoveryId);
      setRecoveryInput("");
      
      console.log("📤 Dispatching emailGenerated event with:", newEmail);
      
      // Show success toast
      toast({
        title: "Temporary Mail Generated",
        description: `Your email ${newEmail} is ready to use!`,
      });
    } catch (error) {
      console.error("❌ Error generating email:", error);
      toast({
        title: "Error",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const extendEmail = () => {
    setExpiresIn(86400); // 24 hours
    setIsExtended(true);
    toast({
      title: "Email Extended",
      description: "Your email is now valid for 24 hours!",
    });
  };

  const copyToClipboard = async () => {
    if (currentEmail) {
      await navigator.clipboard.writeText(currentEmail);
      toast({
        title: "Copied!",
        description: "Email address copied to clipboard",
      });
    }
  };

  const copyRecoveryId = async () => {
    if (recoveryId) {
      await navigator.clipboard.writeText(recoveryId);
      toast({
        title: "Recovery ID Copied!",
        description: "Save this ID to recover your mailbox after it expires",
      });
    }
  };

  const recoverEmail = async () => {
    const id = recoveryInput.trim().toUpperCase();

    if (!id) {
      toast({
        title: "Recovery ID Required",
        description: "Please enter the recovery ID of your expired mailbox.",
        variant: "destructive",
      });
      return;
    }

    setIsRecovering(true);
    try {
      // Small delay so the loading state is visible
      await new Promise(resolve => setTimeout(resolve, 800));

      const account = tempMailAPI.recoverAccount(id);
      if (!account) {
        toast({
          title: "Invalid Recovery ID",
          description: "No matching mailbox was found. Check the ID and try again.",
          variant: "destructive",
        });
        return;
      }

      setCurrentEmail(account.address);
      setExpiresIn(600); // 10 minutes
      setIsExtended(false);
      setRecoveryId(id);
      setRecoveryInput("");

      toast({
        title: "Mailbox Recovered",
        description: `${account.address} is active again for the next 10 minutes.`,
      });
    } catch (error) {
      console.error("❌ Error recovering email:", error);
      toast({
        title: "Error",
        description: "Failed to recover the mailbox. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-lato">
          <RefreshCw className="h-5 w-5" />
          Temporary Mail Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentEmail ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="font-mono text-sm break-all">{currentEmail}</span>
              <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-ubuntu text-muted-foreground">
                <Clock className="h-4 w-4" />
                {isExtended ? "Expires in:" : "Temp Mail -"} {formatTime(expiresIn)}
              </div>
              <div className="status-active">
                <CheckCircle className="h-3 w-3" />
                Active
              </div>
            </div>

            {!isExtended && expiresIn > 0 && (
              <Button 
                onClick={extendEmail}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Extend to 24 Hours
              </Button>
            )}

            <button
              type="button"
              onClick={() => setShowRecoveryId(!showRecoveryId)}
              className="flex w-full items-center justify-between text-sm font-ubuntu text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              <span className="flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5" />
                Show Recovery ID
              </span>
              {showRecoveryId ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showRecoveryId && (
              <div className="space-y-2 animate-slide-up">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed">
                  <div className="flex items-center gap-2 min-w-0">
                    <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-ubuntu text-muted-foreground">Recovery ID</p>
                      <p className="font-mono text-sm break-all">{recoveryId}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={copyRecoveryId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs font-ubuntu text-muted-foreground">
                  Save this recovery ID - use it to get this same mailbox back for another 10 minutes after it expires.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground font-ubuntu mb-4">
              Generate a temporary email address to get started
            </p>
          </div>
        )}
        
        <Button 
          onClick={generateEmail} 
          disabled={isGenerating}
          className="w-full btn-hero"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              {currentEmail ? "Generate New Temporary Mail" : "Generate Temporary Mail"}
            </>
          )}
        </Button>

        {/* Recover expired mailbox (collapsed by default) */}
        <div className="border-t pt-3">
          <Button
            type="button"
            onClick={() => setShowRecoverForm(!showRecoverForm)}
            variant="ghost"
            size="sm"
            className="w-full justify-between px-1 font-ubuntu text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Recover Expired Mailbox
            </span>
            {showRecoverForm ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showRecoverForm && (
            <div className="space-y-3 pt-3 animate-slide-up">
              <p className="text-sm font-ubuntu text-muted-foreground">
                Enter the recovery ID of an expired mailbox to get the same email address back for 10 minutes.
              </p>
              <div className="flex gap-2">
                <Input
                  value={recoveryInput}
                  onChange={(e) => setRecoveryInput(e.target.value)}
                  placeholder="FLUX-XXXX-XXXX"
                  className="font-mono uppercase flex-1"
                  aria-label="Recovery ID"
                />
                <Button
                  onClick={recoverEmail}
                  disabled={isRecovering}
                  variant="outline"
                  className="shrink-0"
                >
                  {isRecovering ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Undo2 className="h-4 w-4 mr-2" />
                  )}
                  Recover
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
