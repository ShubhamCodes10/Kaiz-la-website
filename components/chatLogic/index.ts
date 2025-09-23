import { NextResponse } from 'next/server';
import type { Message, Conversation } from '@/types/chat';
import { getLocalIntent } from './utils/intent';
import { getTrustBuildingReply } from './utils/trustBuilding';
import { getQualificationQuestion } from './utils/qualification';
import { handleRAG } from './services/rag';
import {
  createNewConversation,
  saveMessage,
  getConversation,
  updateConversationStage
} from './services/database';
import {
  processProductStage,
  processVolumeStage,
  processRegionStage,
  processTimelineStage,
  processContactStage,
  processScheduleStage
} from './services/leadProcessing';
import { readStreamResponse } from './utils/responseHandler';
import { prisma } from '@/lib/prisma';

export async function processChatRequest(messages: Message[], conversationId: string): Promise<NextResponse> {
  try {
    const userMessage = messages[messages.length - 1];
    const isNewConversation = messages.length === 1;

    if (isNewConversation) {
      await createNewConversation(conversationId, userMessage);
      await saveMessage(userMessage.content, 'user', conversationId);
      const lowerCaseMessage = userMessage.content.toLowerCase();

      if (lowerCaseMessage.includes('services') || lowerCaseMessage.includes('business') || lowerCaseMessage.includes('expertise') || lowerCaseMessage.includes('different')) {
        const greeting = "Hello and welcome to Kaiz La! I'm KaiExpert, your virtual sourcing assistant. That's a great question.\n\n";
        const ragResponse = await handleRAG(userMessage.content, true);
        const ragText = await readStreamResponse(ragResponse);
        return new NextResponse(greeting + ragText);
      }
      
      const responseText = "Hi there! I'm here to help you get started with your sourcing needs. To begin, could you tell me what product you are looking to source?";
      return new NextResponse(responseText);
    }

    const conversation: Conversation | null = await getConversation(conversationId);
    if (!conversation) {
      return handleRAG(userMessage.content);
    }

    await saveMessage(userMessage.content, 'user', conversationId);

    if (conversation.stage === 'completed') {
      const lowerCaseMessage = userMessage.content.toLowerCase();
      
      if (lowerCaseMessage.includes('another') || lowerCaseMessage.includes('new') || lowerCaseMessage.includes('source something')) {
        await updateConversationStage(conversationId, 'product');
        const firstQuestion = getQualificationQuestion('product');
        return new NextResponse(`Of course, I can help with a new request. ${firstQuestion}`);
      }
      
      const lead = await prisma.lead.findUnique({
        where: { conversationId },
        select: { scheduledCall: true, callDate: true }
      });

      if (lead?.scheduledCall && lead.callDate) {
        const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(lead.callDate);
        return new NextResponse(`Perfect, I've just received the confirmation. Your meeting is booked for ${formattedDate}. We look forward to speaking with you!`);
      }

      if (lowerCaseMessage.includes('book') || lowerCaseMessage.includes('done') || lowerCaseMessage.includes('scheduled')) {
        return new NextResponse("That's wonderful! Our team will receive the details shortly. We look forward to speaking with you. Have a great day!");
      }

      const ragResponse = await handleRAG(userMessage.content);
      const ragResponseText = await readStreamResponse(ragResponse);
      return new NextResponse(ragResponseText);
    }

    const userIntent = await getLocalIntent(userMessage.content, conversation.stage);

    if (userIntent === 'GENERAL_QUESTION_INTENT') {
      const ragResponse = await handleRAG(userMessage.content);
      const nextQuestion = getQualificationQuestion(conversation.stage);
      const ragResponseText = await readStreamResponse(ragResponse);
      return new NextResponse(`${ragResponseText}\n\n${nextQuestion}`);
    }

    if (userIntent === 'OFF_TOPIC_INTENT') {
      const nextQuestion = getQualificationQuestion(conversation.stage);
      return new NextResponse("I'm sorry, I can't help with that right now. " + nextQuestion);
    }

    let result: { nextStage: string; nextBotReply: string };
    switch (conversation.stage) {
      case 'product': result = await processProductStage(userMessage, conversationId); break;
      case 'volume': result = await processVolumeStage(userMessage, conversationId); break;
      case 'region': result = await processRegionStage(userMessage, conversationId); break;
      case 'timeline': result = await processTimelineStage(userMessage, conversationId); break;
      case 'contact': result = await processContactStage(userMessage, conversationId); break;
      case 'schedule': result = await processScheduleStage(userMessage, conversationId); break;
      default:
        const ragResponse = await handleRAG(userMessage.content);
        const nextQuestionDefault = getQualificationQuestion(conversation.stage);
        const ragResponseTextDefault = await readStreamResponse(ragResponse);
        return new NextResponse(`${ragResponseTextDefault}\n\n${nextQuestionDefault}`);
    }

    await updateConversationStage(conversationId, result.nextStage);
    const trustBuildingReply = await getTrustBuildingReply(userMessage.content);
    let finalReply = result.nextBotReply;
    if (trustBuildingReply) {
      finalReply = `${trustBuildingReply}\n\n${result.nextBotReply}`;
    }
    return new NextResponse(finalReply);

  } catch (error) {
    console.error('Chat processing error:', error);
    return new NextResponse("I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.");
  }
}