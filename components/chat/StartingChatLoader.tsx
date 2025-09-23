import { Loader2 } from "lucide-react";

export function StartingChatLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="flex flex-col items-center gap-6 p-8 bg-card rounded-2xl shadow-lg">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
          <div className="relative flex aspect-square size-16 items-center justify-center rounded-full bg-primary/10 shadow-md">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Starting your conversation</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Setting up your new chat session with our AI assistant...
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-0"></div>
          <div className="h-2 w-2 bg-primary/70 rounded-full animate-bounce delay-150"></div>
          <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
}