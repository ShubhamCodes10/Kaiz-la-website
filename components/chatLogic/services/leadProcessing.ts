import type { Message } from '@/types/chat';
import { updateLeadData } from './database';
import { sendNewLeadNotification } from './notifications';
import { prisma } from '@/lib/prisma';

export async function processProductStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { productInterest: userMessage.content });
  return {
    nextStage: 'volume',
    nextBotReply: "Got it. Could you tell me your expected order volume for this product?"
  };
}

export async function processVolumeStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { orderVolume: userMessage.content });
  return {
    nextStage: 'region',
    nextBotReply: "Thank you.  Where will you be sourcing for? (For example: India, Qatar or the UAE)"
  };
}

export async function processRegionStage(userMessage: Message, conversationId:string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { preferredRegion: userMessage.content });
  return {
    nextStage: 'timeline',
    nextBotReply: "Okay. What is your sourcing timeline? Are you looking for a quick turnaround or a long-term plan?"
  };
}

export async function processTimelineStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { sourcingTimeline: userMessage.content });
  const confidentialityMessage = "Your details are kept 100% confidential under our NDA-backed process.";
  const nextQuestion = "Great. I have all the sourcing details. Now, to connect you with the right Kaiz La executive, please share your name, company, and preferred contact (email or phone).\n\n(e.g., John Doe, Acme Inc, john@acme.com, 555-123-4567)";
  return {
    nextStage: 'contact',
    nextBotReply: `${confidentialityMessage}\n\n${nextQuestion}`
  };
}

export async function processContactStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  const input = userMessage.content;
  const parts = input.split(/,/).map(part => part.trim());

  let name: string | undefined;
  let company: string | undefined;
  let email: string | undefined;
  let phone: string | undefined;

  const emailRegex = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i;
  const phoneRegex = /\b\d{7,}\b/;
  const remainingParts: string[] = [];

  parts.forEach(part => {
    if (emailRegex.test(part) && !email) {
      email = part;
    } else if (phoneRegex.test(part) && !phone) {
      phone = part;
    } else {
      remainingParts.push(part);
    }
  });

  if (remainingParts.length > 0) {
    name = remainingParts[0];
  }
  if (remainingParts.length > 1) {
    company = remainingParts[1];
  }

  await updateLeadData(conversationId, { name, company, email, phone });
  const fullLead = await prisma.lead.findUnique({
    where: { conversationId }
  });
  if (fullLead) {
    sendNewLeadNotification(fullLead);
  }

  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK;
  const replyPayload = {
    type: 'calendly-link',
    text: "Would you like to book a call with our team to go over your sourcing needs? Just pick a time using the button below, and type 'Scheduled' here once you’re done.",
    url: calendlyLink
  };

  return {
    nextStage: 'completed',
    nextBotReply: JSON.stringify(replyPayload)
  };
}

export async function processScheduleStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  const wantsCall = userMessage.content.toLowerCase().includes('yes') ||
    userMessage.content.toLowerCase().includes('sure') ||
    userMessage.content.toLowerCase().includes('ok') ||
    userMessage.content.toLowerCase().includes('okay');

  await updateLeadData(conversationId, { scheduledCall: wantsCall });

  if (wantsCall) {
    const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK;
    const replyPayload = {
      type: 'calendly-link',
      text: 'Great! Please use the button below to book your call. Once you are done, just type "scheduled" in this chat to confirm.',
      url: calendlyLink
    };
    return {
      nextStage: 'completed',
      nextBotReply: JSON.stringify(replyPayload)
    };
  } else {
    return {
      nextStage: 'completed',
      nextBotReply: "No problem! We have your information and will follow up via email. Feel free to ask me any questions about our sourcing services anytime."
    };
  }
}