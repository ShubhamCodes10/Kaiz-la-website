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
        <header className="flex h-16 sm:h-18 lg:h-20 shrink-0 items-center gap-4 px-4 sm:px-6 lg:px-8 bg-card/95 backdrop-blur-md shadow-md">
          <div className="container mx-auto max-w-7xl flex items-center justify-between w-full">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group" aria-label="Kaiz La Home">
                <Image
                  src="/logo.png"
                  alt="Kaiz La Logo"
                  width={180}
                  height={100}
                  className="transition-transform duration-300 group-hover:scale-105 dark:filter dark:[filter:brightness(0)_invert(35%)_sepia(95%)_saturate(5000%)_hue-rotate(325deg)]"
                  priority
                />
              </Link>
            </div>

            <div className="flex items-center gap-3 xl:gap-4">
              <Link href="/chat">
                <button className="
                  flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-2.5
                  bg-secondary text-white rounded-lg 
                  hover:opacity-90 hover:shadow-md
                  transition-all duration-200 font-medium
                  text-sm xl:text-base
                  focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
                ">
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              </Link>
            </div>
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