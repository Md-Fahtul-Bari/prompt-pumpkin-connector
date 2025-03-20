
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SendIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  webhookUrl: string;
  onPromptSent: (prompt: string, response?: any) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ webhookUrl, onPromptSent }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (!webhookUrl) {
      toast.error("Please configure your n8n webhook URL first");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim()
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        // If the response is not JSON, we'll just use the status text
        data = { message: response.statusText };
      }

      if (response.ok) {
        toast.success("Prompt sent successfully!");
        onPromptSent(prompt, data);
        setPrompt("");
      } else {
        toast.error(`Failed to send prompt: ${response.status} ${response.statusText}`);
        onPromptSent(prompt);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to send prompt: ${errorMessage}`);
      onPromptSent(prompt);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="border bg-card/50 backdrop-blur-sm shadow-subtle transition-all duration-300 hover:shadow-elegant">
        <CardContent className="pt-6">
          <Textarea
            placeholder="Write your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={cn(
              "min-h-32 resize-none border-none shadow-none focus-visible:ring-0 bg-transparent",
              "text-base placeholder:text-muted-foreground/50 transition-all duration-300"
            )}
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2 pb-4 px-6">
          <div className="text-xs text-muted-foreground">
            {webhookUrl ? (
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Connected to n8n
              </span>
            ) : (
              <span className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                Webhook not configured
              </span>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !prompt.trim()} 
            className="transition-all duration-300 relative overflow-hidden group"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <span className="flex items-center">
                  Send
                  <SendIcon className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PromptInput;
