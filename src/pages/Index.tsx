
import React, { useState, useEffect } from 'react';
import WebhookConfig from '@/components/WebhookConfig';
import PromptInput from '@/components/PromptInput';
import ResponseHistory, { HistoryItem } from '@/components/ResponseHistory';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load webhook URL and history from localStorage on component mount
    const savedUrl = localStorage.getItem("n8n_webhook_url");
    if (savedUrl) {
      setWebhookUrl(savedUrl);
    }

    const savedHistory = localStorage.getItem("prompt_history");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      } catch (error) {
        console.error("Failed to parse history from localStorage", error);
      }
    }
  }, []);

  const handleWebhookSaved = (url: string) => {
    setWebhookUrl(url);
  };

  const handlePromptSent = (prompt: string, response?: any) => {
    const newItem: HistoryItem = {
      id: uuidv4(),
      prompt,
      timestamp: new Date(),
      response,
    };

    const updatedHistory = [newItem, ...history].slice(0, 10); // Keep only the latest 10 entries
    setHistory(updatedHistory);

    // Save to localStorage
    localStorage.setItem("prompt_history", JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("prompt_history");
    toast.success("History cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-16 animate-slide-down">
          <div className="mb-3 inline-block px-4 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            n8n Connection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
            Send Prompts to n8n
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Write your prompts here and send them directly to your n8n workflow or AI agent via webhooks.
            Configure your webhook URL and start sending prompts in seconds.
          </p>
        </header>

        <div className="max-w-3xl mx-auto grid gap-8">
          <div className="flex justify-center mb-4">
            <WebhookConfig onWebhookSaved={handleWebhookSaved} />
          </div>

          <PromptInput 
            webhookUrl={webhookUrl} 
            onPromptSent={handlePromptSent} 
          />

          {history.length > 0 && (
            <div className="flex flex-col gap-2">
              <ResponseHistory history={history} />
              <div className="flex justify-end">
                <button
                  onClick={clearHistory}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  Clear history
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-24 text-center text-sm text-muted-foreground">
          <p>Connect your n8n workflows and AI agents with ease.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
