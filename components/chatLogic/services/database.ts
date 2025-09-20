import { prisma } from '@/lib/prisma';
import { generateTitle } from '@/lib/ai';
import type { Message, LeadData } from '@/types/chat';

export async function createNewConversation(conversationId: string, userMessage: Message): Promise<void> {
  const title = await generateTitle(userMessage.content);
  await prisma.conversation.create({
    data: {
      id: conversationId,
      title: title,
      stage: 'product',
      lead: {
        create: {}
      }
    }
  });
}

export async function saveMessage(content: string, role: 'user' | 'assistant', conversationId: string): Promise<void> {
  await prisma.message.create({
    data: {
      content,
      role,
      conversationId,
    },
  });
}

export async function getConversation(conversationId: string) {
  return await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { stage: true, lead: true },
  });
}

export async function updateLeadData(conversationId: string, data: LeadData): Promise<void> {
  await prisma.lead.update({
    where: { conversationId },
    data,
  });
}

export async function updateConversationStage(conversationId: string, stage: string): Promise<void> {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { stage },
  });
}