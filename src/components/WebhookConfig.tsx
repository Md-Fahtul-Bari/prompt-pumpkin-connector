
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Settings, Check, X } from "lucide-react";

interface WebhookConfigProps {
  onWebhookSaved: (url: string) => void;
}

const WebhookConfig: React.FC<WebhookConfigProps> = ({ onWebhookSaved }) => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Load webhook URL from localStorage on component mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("n8n_webhook_url");
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }
  }, []);

  const saveWebhookUrl = () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL");
      return;
    }

    try {
      // Simple URL validation
      new URL(webhookUrl);
      
      // Save to localStorage
      localStorage.setItem("n8n_webhook_url", webhookUrl);
      toast.success("Webhook URL saved successfully");
      setIsOpen(false);
      onWebhookSaved(webhookUrl);
    } catch (error) {
      toast.error("Please enter a valid URL");
    }
  };

  const testWebhook = async () => {
    if (!webhookUrl) {
      toast.error("Please enter a webhook URL first");
      return;
    }

    setIsTestingWebhook(true);
    
    try {
      // Send a test payload to the webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "test",
          message: "This is a test message from your application",
        }),
      });

      if (response.ok) {
        toast.success("Webhook test successful!");
      } else {
        toast.error(`Webhook test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      toast.error(`Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="group flex items-center gap-2 h-9 px-3 transition-all duration-300 hover:bg-secondary"
        >
          <Settings className="h-4 w-4 transition-all duration-300 group-hover:rotate-90" />
          <span>Configure Webhook</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 animate-scale-in">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">n8n Webhook Configuration</h3>
            <p className="text-xs text-muted-foreground">
              Enter your n8n webhook URL to connect your workflow.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://n8n.example.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="transition-all duration-300"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={testWebhook}
              variant="outline"
              size="sm"
              disabled={isTestingWebhook || !webhookUrl}
              className="flex-1"
            >
              {isTestingWebhook ? (
                <>
                  <span className="loading-spinner mr-2" />
                  Testing...
                </>
              ) : (
                "Test Webhook"
              )}
            </Button>
            
            <Button
              onClick={saveWebhookUrl}
              size="sm"
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WebhookConfig;
