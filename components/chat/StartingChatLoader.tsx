import { Loader2 } from "lucide-react";

export function StartingChatLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <Loader2 className="size-12 animate-spin text-primary mb-4" />
      <h2 className="text-2xl font-semibold text-foreground">Thinking...</h2>
      <p className="text-muted">Preparing your new chat session.</p>
    </div>
  );
}