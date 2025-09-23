import { Bot } from "lucide-react";
import React from 'react';

export const TypingIndicator = () => (
  <div className="flex items-start gap-4 justify-start">
    <div className="flex-shrink-0 size-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center shadow-md animate-pulse">
      <Bot size={18} />
    </div>
    
    <div className="group bg-card shadow-md hover:shadow-lg rounded-2xl p-4 transition-all duration-200 relative">
      <div className="flex items-center gap-3">
        <span className="text-sm text-card-foreground/70 font-medium">AI is thinking</span>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 bg-secondary rounded-full animate-bounce delay-0"></span>
          <span className="h-2 w-2 bg-secondary/80 rounded-full animate-bounce delay-150"></span>
          <span className="h-2 w-2 bg-secondary/60 rounded-full animate-bounce delay-300"></span>
        </div>
      </div>

      {/* Floating tail effect to match MessageBubble */}
      <div className="absolute top-4 w-3 h-3 rotate-45 bg-card -left-1.5 shadow-md" />
      
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-secondary/5 to-transparent -skew-x-12 animate-pulse opacity-30" />
    </div>
  </div>
);