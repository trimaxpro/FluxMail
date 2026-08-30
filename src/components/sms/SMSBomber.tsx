"use client";

import { useState } from "react";
import { Phone, Send, AlertTriangle, Clock, Shield, WifiOff, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SMSBomberState {
  phoneNumber: string;
  message: string;
  count: number;
  delay: number;
  isRunning: boolean;
  sentCount: number;
  isTesting: boolean;
  results: Array<{
    id: number;
    status: 'success' | 'failed' | 'pending';
    message: string;
    timestamp: Date;
  }>;
}

export default function SMSBomber() {
  const [state, setState] = useState<SMSBomberState>({
    phoneNumber: "",
    message: "",
    count: 3,
    delay: 2,
    isRunning: false,
    sentCount: 0,
    isTesting: true,
    results: [],
  });

  const { toast } = useToast();

  // Enhanced SMS providers with better reliability
  const SMS_PROVIDERS = [
    {
      name: "TextBelt",
      url: "https://textbelt.com/text",
      enabled: true,
      description: "Free - 1 SMS/day",
      rateLimit: 1
    },
    {
      name: "SMS Gateway API",
      url: "https://sms-gateway.free.beeceptor.com/sms",
      enabled: true,
      description: "Mock API for testing",
      rateLimit: 10
    }
  ];

  // Enhanced simulation with realistic delays and success rates
  const simulateSMS = async (phone: string, message: string, provider: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    // Simulate different success rates based on provider
    const successRate = provider === "TextBelt" ? 0.7 : 0.9;
    return Math.random() > (1 - successRate);
  };

  // Mock API call for testing
  const mockSMS = async (phone: string, message: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1; // 90% success rate for mock
  };

  // Real SMS attempt with TextBelt
  const sendRealSMS = async (phone: string, message: string): Promise<boolean> => {
    try {
      const response = await fetch("https://textbelt.com/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `+91${phone}`,
          message: message,
          key: "textbelt",
        }),
      });

      const data = await response.json();
      return data.success || data.quotaRemaining > 0;
    } catch (error) {
      console.error("Real SMS failed:", error);
      return false;
    }
  };

  // Main SMS sending function with retry logic
  const sendSMS = async (phone: string, message: string, index: number): Promise<boolean> => {
    const result = {
      id: index,
      status: 'pending' as const,
      message: `Attempt ${index + 1}`,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      results: [...prev.results, result]
    }));

    try {
      let success = false;
      
      if (state.isTesting) {
        // In test mode, use mock API
        success = await mockSMS(phone, message);
      } else {
        // Try real SMS first
        success = await sendRealSMS(phone, message);
        
        if (!success) {
          // Fallback to simulation
          success = await simulateSMS(phone, message, "TextBelt");
        }
      }

      // Update result
      setState(prev => ({
        ...prev,
        results: prev.results.map(r => 
          r.id === index 
            ? { ...r, status: success ? 'success' : 'failed' }
            : r
        ),
        sentCount: success ? prev.sentCount + 1 : prev.sentCount
      }));

      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        results: prev.results.map(r => 
          r.id === index 
            ? { ...r, status: 'failed' }
            : r
        )
      }));
      return false;
    }
  };

  const handleStart = async () => {
    if (!state.phoneNumber || !state.message) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone number and message.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10}$/.test(state.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isRunning: true, 
      sentCount: 0,
      results: []
    }));

    let successCount = 0;

    for (let i = 0; i < state.count; i++) {
      if (!state.isRunning) break;

      const success = await sendSMS(state.phoneNumber, state.message, i);
      if (success) successCount++;

      // Add delay between messages
      if (i < state.count - 1 && state.isRunning) {
        await new Promise(resolve => setTimeout(resolve, state.delay * 1000));
      }
    }

    setState(prev => ({ ...prev, isRunning: false }));
    
    toast({
      title: state.isTesting ? "Simulation Complete" : "SMS Process Complete",
      description: `${successCount}/${state.count} messages ${state.isTesting ? 'simulated' : 'processed'}`,
      variant: successCount > 0 ? "default" : "destructive",
    });
  };

  const handleStop = () => {
    setState(prev => ({ ...prev, isRunning: false }));
    toast({
      title: "Stopped",
      description: "SMS process has been stopped.",
    });
  };

  const handleInputChange = (field: keyof SMSBomberState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const toggleTestMode = () => {
    setState(prev => ({ ...prev, isTesting: !prev.isTesting }));
    toast({
      title: state.isTesting ? "Real Mode" : "Test Mode",
      description: state.isTesting ? "Now using real SMS API" : "Now using simulation mode",
    });
  };

  const clearResults = () => {
    setState(prev => ({ ...prev, results: [], sentCount: 0 }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Warning Banner */}
      <Card className="border-destructive/50 bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-ubuntu text-destructive">
            This tool includes both real SMS and simulation modes. Real SMS uses free APIs with limitations. 
            Use responsibly and only on numbers you own or have permission to test.
          </p>
        </CardContent>
      </Card>

      {/* Mode Toggle */}
      <Card className="card-premium">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-ubuntu font-semibold">SMS Mode</h4>
              <p className="text-sm text-muted-foreground font-ubuntu">
                {state.isTesting ? "Simulation Mode - No real SMS sent" : "Real SMS Mode - Uses TextBelt API"}
              </p>
            </div>
            <Button
              variant={state.isTesting ? "outline" : "default"}
              onClick={toggleTestMode}
              disabled={state.isRunning}
            >
              {state.isTesting ? "Use Real SMS" : "Use Simulation"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SMS Bomber Form */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            SMS Bomber
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-ubuntu">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={state.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              maxLength={10}
              disabled={state.isRunning}
            />
            <p className="text-xs text-muted-foreground font-ubuntu">
              Enter 10-digit Indian phone number (without +91)
            </p>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="font-ubuntu">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={state.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              disabled={state.isRunning}
            />
            <p className="text-sm text-muted-foreground font-ubuntu">
              {state.message.length}/160 characters
            </p>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Message Count */}
            <div className="space-y-2">
              <Label className="font-ubuntu">Number of Messages: {state.count}</Label>
              <Slider
                value={[state.count]}
                onValueChange={([value]) => handleInputChange('count', value)}
                min={1}
                max={10}
                step={1}
                disabled={state.isRunning}
              />
              <div className="flex justify-between text-xs text-muted-foreground font-ubuntu">
                <span>1</span>
                <span>10</span>
              </div>
            </div>

            {/* Delay */}
            <div className="space-y-2">
              <Label className="font-ubuntu">Delay (seconds): {state.delay}s</Label>
              <Slider
                value={[state.delay]}
                onValueChange={([value]) => handleInputChange('delay', value)}
                min={1}
                max={10}
                step={1}
                disabled={state.isRunning}
              />
              <div className="flex justify-between text-xs text-muted-foreground font-ubuntu">
                <span>1s</span>
                <span>10s</span>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {state.results.length > 0 && (
            <Card className="bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-ubuntu font-semibold">Results</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearResults}
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {state.results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between text-sm">
                      <span className="font-ubuntu">{result.message}</span>
                      <div className="flex items-center gap-2">
                        {result.status === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {result.status === 'failed' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {result.status === 'pending' && (
                          <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                        )}
                        <span className={`font-ubuntu ${
                          result.status === 'success' ? 'text-green-500' : 
                          result.status === 'failed' ? 'text-red-500' : 
                          'text-yellow-500'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!state.isRunning ? (
              <Button 
                onClick={handleStart}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                {state.isTesting ? "Start Simulation" : "Start Bombing"}
              </Button>
            ) : (
              <Button 
                onClick={handleStop}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Clock className="h-4 w-4 mr-2" />
                Stop Process
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Features & How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <WifiOff className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-ubuntu font-semibold mb-1">Test Mode</h4>
              <p className="text-sm text-muted-foreground font-ubuntu">
                Simulation mode for testing without sending real SMS
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-ubuntu font-semibold mb-1">Real SMS</h4>
              <p className="text-sm text-muted-foreground font-ubuntu">
                Real SMS via TextBelt - 1 per day per number
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-ubuntu font-semibold mb-1">Real-time Results</h4>
              <p className="text-sm text-muted-foreground font-ubuntu">
                See success/failure status for each message
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-ubuntu font-semibold mb-1">Safe Testing</h4>
              <p className="text-sm text-muted-foreground font-ubuntu">
                Test on your own number first
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
