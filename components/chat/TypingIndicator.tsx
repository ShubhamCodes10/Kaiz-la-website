import { Bot } from "lucide-react";
import React from 'react';

export const TypingIndicator = () => (
  <div className="flex items-center gap-3 mb-4 justify-start">
    <div className="flex-shrink-0 size-8 rounded-full bg-secondary text-background flex items-center justify-center">
      <Bot size={20} />
    </div>
    <div className="p-3 rounded-lg bg-card border border-border flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Thinking</span>
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 bg-muted rounded-full animate-bounce delay-0"></span>
        <span className="h-1.5 w-1.5 bg-muted rounded-full animate-bounce delay-150"></span>
        <span className="h-1.5 w-1.5 bg-muted rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  </div>
);