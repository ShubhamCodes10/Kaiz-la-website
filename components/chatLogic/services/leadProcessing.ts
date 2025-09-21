import type { Message } from '@/types/chat';
import { updateLeadData } from './database';
import { sendNewLeadNotification } from './notifications';
import { prisma } from '@/lib/prisma';

export async function processProductStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { productInterest: userMessage.content });
  return {
    nextStage: 'volume',
    nextBotReply: "Got it. And what's the expected order volume for this product?"
  };
}

export async function processVolumeStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { orderVolume: userMessage.content });
  return {
    nextStage: 'region',
    nextBotReply: "Thank you. Which region are you looking to source from? For example, Asia, Europe, or North America."
  };
}

export async function processRegionStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { preferredRegion: userMessage.content });
  return {
    nextStage: 'timeline',
    nextBotReply: "Okay. What is your sourcing timeline? Are you looking for a quick turnaround or a long-term plan?"
  };
}

export async function processTimelineStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  await updateLeadData(conversationId, { sourcingTimeline: userMessage.content });
  return {
    nextStage: 'contact',
    nextBotReply: "Great. I have all the sourcing details. Now, could you please provide your name, company, and email or phone number so we can get in touch?"
  };
}

export async function processContactStage(userMessage: Message, conversationId: string): Promise<{ nextStage: string; nextBotReply: string }> {
  const nameMatch = userMessage.content.match(/name is (.+?)(,|$)/i) || userMessage.content.match(/^(.+?)(,|$)/);
  const emailMatch = userMessage.content.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i);
  const phoneMatch = userMessage.content.match(/\b\d{10,}\b/);
  const companyMatch = userMessage.content.match(/company (.+?)(,|$)/i);

   await updateLeadData(conversationId, {
    name: nameMatch ? nameMatch[1].trim() : undefined,
    email: emailMatch ? emailMatch[0].trim() : undefined,
    phone: phoneMatch ? phoneMatch[0].trim() : undefined,
    company: companyMatch ? companyMatch[1].trim() : undefined,
  });

  const fullLead = await prisma.lead.findUnique({
    where: {conversationId}
  });

  if(fullLead){
     sendNewLeadNotification(fullLead);
  }

  return {
    nextStage: 'schedule',
    nextBotReply: "Thank you! I've captured your details. Would you like to schedule a call with the Kaiz La team to discuss your sourcing needs in more detail?"
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