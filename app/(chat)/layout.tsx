'use client';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/chat/Sidebar';
import React, { ReactNode } from 'react';
import { MessageSquare } from "lucide-react";

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider 
      style={{
        ['--sidebar-width' as string]: "20rem", // 320px - increased from default
        ['--sidebar-width-mobile' as string]: "18rem" // 288px for mobile
      }} 
      defaultOpen={true}
    >
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        
        <main className="flex flex-1 flex-col h-full min-w-0">
          <header className="flex h-18 shrink-0 items-center gap-4 px-4 sm:px-6 border-b border-border/50 bg-card shadow-sm">
            <SidebarTrigger className="h-8 w-8 cursor-pointer hover:bg-secondary/10 transition-colors duration-200 rounded-md flex items-center justify-center" />
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-sm">
                <MessageSquare className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <h1 className="text-base font-semibold text-foreground">Kaiz La Chat</h1>
                <span className="text-xs text-muted-foreground hidden sm:block">AI Assistant</span>
              </div>
            </div>

            {/* Optional: Add header actions space */}
            <div className="flex items-center gap-2">
            </div>
          </header>

          {/* Main content area with proper scrolling */}
          <div className="flex-1 overflow-hidden bg-background">
            <div className="h-full overflow-y-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}