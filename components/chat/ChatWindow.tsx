'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, type Message as MessageType } from '@/store/chatStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Bot, Send } from "lucide-react"; 
import { TypingIndicator } from './TypingIndicator';
import { StartingChatLoader } from './StartingChatLoader';

interface ChatWindowProps {
  conversationId?: string;
}

export function ChatWindow({ conversationId: currentConversationId }: ChatWindowProps) {
  const router = useRouter();
  const { messages, setMessages, fetchMessages } = useChatStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);

  useEffect(() => {
    if (!currentConversationId) {
      setMessages([]);
    }
  }, [currentConversationId, setMessages]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    
    const isNewChat = !currentConversationId;
    const conversationId = currentConversationId || crypto.randomUUID();
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      conversationId,
      createdAt: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    if (isNewChat) {
      setIsStartingNewChat(true);
      router.push(`/chat/${conversationId}`);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: [...messages, userMessage],
          conversationId,
        }),
      });

      if (!response.body) throw new Error("Response body is empty.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = '';
      const assistantMessageId = crypto.randomUUID();
      const assistantCreatedAt = new Date();
      
      let firstChunkReceived = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (!firstChunkReceived && value) {
          setIsStartingNewChat(false);
          firstChunkReceived = true;
          setMessages([
            ...messages,
            userMessage,
            { id: assistantMessageId, role: 'assistant', content: '', conversationId, createdAt: assistantCreatedAt }
          ]);
        }

        if (done) break;
        
        assistantResponse += decoder.decode(value, { stream: true });
        
        setMessages([
          ...messages,
          userMessage,
          { id: assistantMessageId, role: 'assistant', content: assistantResponse, conversationId, createdAt: assistantCreatedAt }
        ]);
      }
      setIsLoading(false);

      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: assistantMessageId,
          content: assistantResponse,
          role: 'assistant',
          conversationId: conversationId,
          createdAt: assistantCreatedAt,
        }),
      });

    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      setIsLoading(false);
      setIsStartingNewChat(false); 
    }
  };

  if (isStartingNewChat) {
    return <StartingChatLoader />;
  }
  
  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1" ref={viewportRef}>
        <div className="max-w-4xl mx-auto py-6 px-4">
          {messages.length === 0 && !isLoading && !currentConversationId ? (
            <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-14rem)]">
              <div className="mb-4 flex aspect-square size-20 items-center justify-center rounded-full bg-secondary text-white">
                <Bot size={48} />
              </div>
              <h1 className="text-5xl font-bold text-foreground tracking-tight">Kaiz La Chat</h1>
              <p className="text-muted-foreground mt-3 text-lg">Ask anything to begin.</p>
            </div>
          ) : (
            messages.map((message: any) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-background border-border focus:border-primary h-12 px-4"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 w-12"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}