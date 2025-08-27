'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useChatStore, type Conversation } from "@/store/chatStore";
import { Trash2, Plus, MessageSquare, Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarSkeleton } from "./SidebarSkeleton";
import { ResizeHandle } from "./ResizeHandle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AppSidebar() {
  const { conversations, fetchConversations, deleteConversation, isLoading } = useChatStore();
  const pathname = usePathname();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleDelete = async () => {
    if (!conversationToDelete) return;
    await deleteConversation(conversationToDelete);
    if (pathname === `/chat/${conversationToDelete}`) {
      window.location.href = '/chat';
    }
    setIsDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  const openDeleteDialog = (conversationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConversationToDelete(conversationId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon" className="group relative border-r border-border">
        <div className="flex flex-col h-full bg-card">
          <SidebarHeader className="border-b border-border/50 pb-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="h-12 px-3 py-2 hover:bg-secondary/10 transition-colors duration-200">
                  <Link href="/chat" className="flex items-center gap-3">
                    <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-sm">
                      <MessageSquare className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold text-foreground text-sm">New Chat</span>
                      <span className="text-xs text-muted-foreground">Start a conversation</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuAction asChild className="opacity-70 hover:opacity-100 transition-opacity duration-200">
                  <Link href="/chat" className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary/10">
                    <Plus className="size-4" />
                  </Link>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent className="flex-1 overflow-y-auto">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-2 py-2">
                  {isLoading && conversations.length === 0 ? (
                    <SidebarSkeleton />
                  ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center group-data-[collapsible=icon]:hidden">
                      <div className="flex aspect-square size-14 items-center justify-center rounded-full bg-background border border-border/50 mb-4 shadow-sm">
                        <MessageSquare className="size-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">No chats yet</p>
                      <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">
                        Start your first conversation to see it appear here
                      </p>
                    </div>
                  ) : (
                    conversations.map((conversation: Conversation) => {
                      const isActive = pathname === `/chat/${conversation.id}`;
                      return (
                        <SidebarMenuItem key={conversation.id}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={isActive} 
                            tooltip={conversation.title}
                            className={`
                              h-11 px-3 py-2 rounded-lg transition-all duration-200 group/item relative
                              ${isActive 
                                ? 'bg-primary/8 text-primary shadow-sm' 
                                : 'hover:bg-secondary/8 hover:shadow-sm'
                              }
                            `}
                          >
                            <Link href={`/chat/${conversation.id}`} className="flex items-center gap-2 w-full min-w-0">
                              {/* Active indicator */}
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full" />
                              )}
                              <MessageSquare 
                                className={`
                                  size-4 flex-shrink-0 transition-colors duration-200
                                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                                `} 
                              />
                              <span className={`
                                flex-1 truncate text-sm font-medium transition-colors duration-200
                                ${isActive 
                                  ? 'text-primary font-semibold' 
                                  : 'text-foreground group-hover/item:text-foreground'
                                }
                              `}>
                                {conversation.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                          <SidebarMenuAction
                            onClick={(e) => openDeleteDialog(conversation.id, e)}
                            className={`
                              size-8 flex items-center justify-center rounded-md transition-all duration-200
                              hover:bg-destructive/10 hover:text-destructive 
                              group-data-[collapsible=icon]:hidden cursor-pointer
                              opacity-0 group-hover/item:opacity-100
                              ${isActive ? 'opacity-70' : ''}
                            `}
                          >
                            <Trash2 className="size-3.5" />
                          </SidebarMenuAction>
                        </SidebarMenuItem>
                      );
                    })
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Enhanced Footer with better styling */}
          <SidebarFooter className="group-data-[collapsible=icon]:hidden border-t border-border/50 mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  size="sm" 
                  className="h-16 px-3 py-2 hover:bg-secondary/5 transition-colors duration-200"
                >
                  <div className="flex aspect-square size-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-sm">
                    K
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="text-sm font-medium text-foreground">Kaiz La Chat</span>
                    <span className="text-xs text-muted-foreground">AI Assistant</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <ResizeHandle />
          <SidebarRail />
        </div>
      </Sidebar>

      {/* Enhanced Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border border-border shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete your
              conversation and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-background hover:bg-background/80 text-foreground border border-border">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}