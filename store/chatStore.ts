import { create } from 'zustand';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  conversationId: string;
};

export type Conversation = {
  id: string;
  createdAt: Date;
  title: string;
};

type ChatState = {
  conversations: Conversation[];
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  setMessages: (messages: Message[]) => void; 
};

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: [],
  isLoading: false,
  error: null,

  setMessages: (messages) => set({ messages }),

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/conversations', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) throw new Error('Failed to fetch conversations.');
      const conversations = await response.json();
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchMessages: async (conversationId: string) => {
    get().setMessages([]);
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/conversations/${conversationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages.');
      const messages: Message[] = await response.json();
      get().setMessages(messages);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteConversation: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete conversation.');
      await get().fetchConversations();
      if (get().messages.some(msg => msg.conversationId === conversationId)) {
        get().setMessages([]);
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));