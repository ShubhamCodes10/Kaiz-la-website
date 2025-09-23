'use client';

import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore, type Message as MessageType } from '@/store/chatStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Bot, Send, MessageSquare, Calendar, Search } from "lucide-react";
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
    const scrollToBottom = () => {
      if (viewportRef.current) {
        const viewport = viewportRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    };
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1" ref={viewportRef}>
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
          {messages.length === 0 && !isLoading && !currentConversationId ? (
            <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-28rem)] sm:min-h-[calc(100vh-24rem)] md:min-h-[calc(100vh-22rem)]">
              <div className="mb-4 flex aspect-square size-20 sm:size-24 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg">
                <Bot className="size-10 sm:size-12" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary tracking-tight mb-3">Hi, I'm Kai <span className='text-primary'>Expert!</span></h1>
              <p className="text-base leading-relaxed sm:text-lg text-muted-foreground max-w-sm sm:max-w-md mb-4 px-4"> Think of me as your personal sourcing
                companion at Kaiz La. I’ll answer your
                queries, guide you through our services,
                and help set up a call with our experts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message: any) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}
        </div>
      </ScrollArea>

      {messages.length === 0 && !isLoading && !currentConversationId && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
            <button
              onClick={() => setInput("Start a new chat")}
              className="px-4 py-3 bg-card hover:bg-card/80 text-card-foreground rounded-xl shadow-sm hover:shadow-md transition-all duration-150 text-sm font-medium flex items-center justify-center gap-2"
            >
              <MessageSquare className="size-4" />
              Start Chat
            </button>
            <button
              onClick={() => setInput("How do I schedule a call?")}
              className="px-4 py-3 bg-card hover:bg-card/80 text-card-foreground rounded-xl shadow-sm hover:shadow-md transition-all duration-150 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="size-4" />
              Schedule a Call
            </button>
            <button
              onClick={() => setInput("Explore sourcing solutions")}
              className="px-4 py-3 bg-card hover:bg-card/80 text-card-foreground rounded-xl shadow-sm hover:shadow-md transition-all duration-150 text-sm font-medium flex items-center justify-center gap-2"
            >
              <Search className="size-4" />
              Explore Sourcing Solutions
            </button>
          </div>
        </div>
      )}

      <div className="bg-background/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-3 p-2 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 h-12 px-4 text-base placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`h-12 w-12 rounded-xl transition-all duration-150 shadow-sm ${input.trim() && !isLoading
                    ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:shadow-md'
                    : 'bg-secondary/50 text-secondary-foreground/50'
                  }`}
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}