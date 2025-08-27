'use client';

import { use, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { ChatWindow } from "@/components/chat/ChatWindow";

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
      <div className="flex items-center justify-center h-full">
        <p className="text-muted">Loading messages...</p>
      </div>
    );
  }

  return <ChatWindow conversationId={conversationId} />;
}