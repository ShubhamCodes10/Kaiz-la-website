'use client';

import { use, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MessageSquare } from "lucide-react";

interface ChatPageProps {
  params: Promise<{ 
    conversationId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { conversationId } = use(params);
  const { fetchMessages, isLoading } = useChatStore();

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4 p-8 bg-card rounded-xl shadow-sm">
          <div className="flex aspect-square size-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shadow-sm animate-pulse">
            <MessageSquare className="size-6" />
          </div>
          <p className="text-muted-foreground text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return <ChatWindow conversationId={conversationId} />;
}