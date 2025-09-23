'use client';

import React, { ReactNode } from 'react';
import { Plus } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background">
      <main className="flex flex-1 flex-col h-full min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-4 px-4 sm:px-6 bg-background/95 backdrop-blur-sm shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link href="/" className="flex items-center group" aria-label="Kaiz La Home">
              <Image
                src="/logo.png"
                alt="Kaiz La Logo"
                width={120}
                height={60}
                className="transition-transform duration-300 group-hover:scale-105 dark:filter dark:[filter:brightness(0)_invert(35%)_sepia(95%)_saturate(5000%)_hue-rotate(325deg)]"
                priority
              />
            </Link>
            {/* <div className="flex flex-col gap-0.5 leading-none ml-2">
              <h1 className="text-base font-semibold text-foreground">KaiExpert</h1>
              <span className="text-xs text-muted-foreground hidden sm:block">AI Sourcing Assistant</span>
            </div> */}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/chat">
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-all duration-150 shadow-sm hover:shadow-md">
                <Plus className="size-4" />
                <span className="hidden sm:inline text-sm font-medium">New Chat</span>
              </button>
            </Link>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}