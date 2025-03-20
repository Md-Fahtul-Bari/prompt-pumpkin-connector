
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  prompt: string;
  timestamp: Date;
  response?: any;
}

interface ResponseHistoryProps {
  history: HistoryItem[];
}

const ResponseHistory: React.FC<ResponseHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full animate-fade-in">
      <Card className="border bg-card/50 backdrop-blur-sm shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Recent Prompts</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[300px] px-6">
          <div className="space-y-4 pb-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  "p-4 rounded-lg animate-slide-up border border-border/50",
                  "transition-all duration-300 hover:border-border/80"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">Prompt</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm mb-3">{item.prompt}</p>
                
                {item.response && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <h4 className="font-medium text-sm mb-1">Response</h4>
                    <pre className="text-xs text-muted-foreground overflow-auto p-2 bg-muted/50 rounded">
                      {typeof item.response === 'object' 
                        ? JSON.stringify(item.response, null, 2) 
                        : String(item.response)
                      }
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ResponseHistory;
