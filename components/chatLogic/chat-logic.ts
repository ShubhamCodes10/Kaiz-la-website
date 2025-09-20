import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { embedQuery, generateChatResponse, generateTitle } from '@/lib/ai';
import { pineconeIndex } from '@/lib/pinecone';
import { Redis } from '@upstash/redis';

const EMBEDDING_RETRY_DELAY = 60000;
const MAX_EMBEDDING_RETRIES = 3;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  stage: string;
  lead: any;
}

const redis = Redis.fromEnv();

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLocalIntent(userMessageContent: string, conversationStage: string): Promise<string> {
  const lowerCaseMessage = userMessageContent.toLowerCase().trim();

  switch (conversationStage) {
    case 'product':
      if (lowerCaseMessage.length > 2 && !lowerCaseMessage.includes('?') && !lowerCaseMessage.includes('what')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'volume':
      if (lowerCaseMessage.match(/(\d+k|\d{1,3}(,\d{3})*|\d{1,}\s*k)/i) || lowerCaseMessage.includes('hundred') || lowerCaseMessage.includes('thousand') || lowerCaseMessage.includes('million')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'region':
      if (lowerCaseMessage.includes('asia') || lowerCaseMessage.includes('europe') || lowerCaseMessage.includes('north america') || lowerCaseMessage.includes('china') || lowerCaseMessage.includes('india')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'timeline':
      if (lowerCaseMessage.includes('quick') || lowerCaseMessage.includes('long-term') || lowerCaseMessage.includes('immediate') || lowerCaseMessage.includes('fast')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'contact':
      if (lowerCaseMessage.includes('@') || lowerCaseMessage.match(/\b\d{10,}\b/)) {
        return 'QUALIFICATION_INTENT';
      }
      break;
    case 'schedule':
      if (lowerCaseMessage.includes('yes') || lowerCaseMessage.includes('sure') || lowerCaseMessage.includes('ok') || lowerCaseMessage.includes('yeah') || lowerCaseMessage.includes('yup')) {
        return 'QUALIFICATION_INTENT';
      }
      break;
  }
  
  if (lowerCaseMessage.includes('what') || lowerCaseMessage.includes('how') || lowerCaseMessage.includes('where') || lowerCaseMessage.includes('who') || lowerCaseMessage.includes('why') || lowerCaseMessage.includes('when') || lowerCaseMessage.includes('can you') || lowerCaseMessage.includes('are you')) {
    return 'GENERAL_QUESTION_INTENT';
  }

  return 'OFF_TOPIC_INTENT';
}

async function getTrustBuildingReply(userMessageContent: string): Promise<string | null> {
  const lowerCaseMessage = userMessageContent.toLowerCase();

  if (lowerCaseMessage.includes('quality') || lowerCaseMessage.includes('defects')) {
    return "I understand that quality is a top priority. Our process includes multi-point QA checks at every stage, ensuring products meet your specifications.";
  }
  if (lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('price')) {
    return "We believe in landed cost transparency. Our pricing is clear and includes all fees upfront, so there are no surprises.";
  }
  if (lowerCaseMessage.includes('new') || lowerCaseMessage.includes('first time')) {
    return "I'm glad you're considering us! We offer end-to-end support for new clients, guiding you through every step from initial inquiry to final delivery.";
  }
  return null;
}

async function embedWithRetry(text: string, retries: number = 0): Promise<number[] | null> {
  try {
    return await embedQuery(text);
  } catch (error: any) {
    if (error?.statusCode === 429 && retries < MAX_EMBEDDING_RETRIES) {
      console.log(`Rate limit hit, retrying in ${EMBEDDING_RETRY_DELAY}ms... (attempt ${retries + 1})`);
      await delay(EMBEDDING_RETRY_DELAY);
      return embedWithRetry(text, retries + 1);
    }
    console.error('Embedding failed after retries:', error);
    return null;
  }
}

async function handleRAG(userMessageContent: string): Promise<NextResponse> {
  try {
    const vector = await embedWithRetry(userMessageContent);

    if (!vector) {
      return new NextResponse("We can source a wide variety of products, from consumer goods to industrial components. To give you the best answer, it's helpful if you can tell me more about your specific needs.");
    }

    const queryResponse = await pineconeIndex.query({
      topK: 3,
      vector,
      includeMetadata: true,
    });

    const MIN_SCORE = 0.7;
    const filteredMatches = queryResponse.matches.filter(
      (match) => match.score && match.score > MIN_SCORE
    );

    const context = filteredMatches.map((m) => m.metadata?.text).join('\n\n');

    const systemPrompt = `
    You are an expert assistant. Your user is asking a question.
    Use the following provided context to answer the user's question as accurately as possible.
    The context is a set of text chunks retrieved from a knowledge base.
    
    RULES:
    1. If the context has the answer, you MUST use the information from the context.
    2. Do not make up information that is not present in the context.
    3. If the context does not contain the answer, you MUST state "I'm sorry, I don't have that information in my knowledge base."
    4. Do not mention the word "context" in your answer. Just provide the answer directly.

    CONTEXT:
    ---
    ${context || 'No relevant context found.'}
    ---
    `;
    const responseStream = await generateChatResponse([{ role: 'user', content: userMessageContent }], systemPrompt);
    return new NextResponse(responseStream.body);
  } catch (error) {
    console.error('RAG handling failed:', error);
    const fallbackText = "I apologize, but I'm experiencing some technical difficulties. Please feel free to ask me any other questions, or we can continue with the sourcing questions.";
    return new NextResponse(fallbackText);
  }
}

function getQualificationQuestion(stage: string): string {
  switch (stage) {
    case 'product': return "To continue, could you tell me what product you are looking to source?";
    case 'volume': return "And what's the expected order volume for this product?";
    case 'region': return "Which region are you looking to source from? For example, Asia, Europe, or North America.";
    case 'timeline': return "What is your sourcing timeline? Are you looking for a quick turnaround or a long-term plan?";
    case 'contact': return "Could you please provide your name, company, and email or phone number so we can get in touch?";
    default: return "To get started with your sourcing needs, please tell me what product you are looking to source?";
  }
}

export async function processChatRequest(messages: Message[], conversationId: string): Promise<NextResponse> {
  try {
    const userMessage = messages[messages.length - 1];
    const isNewConversation = messages.length === 1;

    if (isNewConversation) {
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
      await prisma.message.create({
        data: {
          content: userMessage.content,
          role: 'user',
          conversationId: conversationId,
        },
      });

      const responseText = "Hi there! I'm here to help you get started with your sourcing needs. To begin, could you tell me what product you are looking to source?";
      return new NextResponse(responseText);
    }

    const conversation: Conversation | null = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { stage: true, lead: true },
    });

    if (!conversation) {
      return handleRAG(userMessage.content);
    }

    const userIntent = await getLocalIntent(userMessage.content, conversation.stage);
    
    await prisma.message.create({
      data: {
        content: userMessage.content,
        role: 'user',
        conversationId: conversationId,
      },
    });

    if (userIntent === 'GENERAL_QUESTION_INTENT' || conversation.stage === 'completed') {
        const ragResponse = await handleRAG(userMessage.content);
        const nextQuestion = getQualificationQuestion(conversation.stage);
        
        let ragResponseText = "";
        if (ragResponse.body) {
            const reader = ragResponse.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                ragResponseText += decoder.decode(value);
            }
        }
        
        return new NextResponse(`${ragResponseText}\n\n${nextQuestion}`);
    }

    if (userIntent === 'OFF_TOPIC_INTENT') {
      const nextQuestion = getQualificationQuestion(conversation.stage);
      return new NextResponse("I'm sorry, I can't help with that right now. " + nextQuestion);
    }

    const trustBuildingReply = await getTrustBuildingReply(userMessage.content);
    let nextBotReply = '';
    let nextStage = conversation.stage;

    switch (conversation.stage) {
      case 'product':
        await prisma.lead.update({
          where: { conversationId },
          data: { productInterest: userMessage.content },
        });
        nextStage = 'volume';
        nextBotReply = "Got it. And what's the expected order volume for this product?";
        break;

      case 'volume':
        await prisma.lead.update({
          where: { conversationId },
          data: { orderVolume: userMessage.content },
        });
        nextStage = 'region';
        nextBotReply = "Thank you. Which region are you looking to source from? For example, Asia, Europe, or North America.";
        break;

      case 'region':
        await prisma.lead.update({
          where: { conversationId },
          data: { preferredRegion: userMessage.content },
        });
        nextStage = 'timeline';
        nextBotReply = "Okay. What is your sourcing timeline? Are you looking for a quick turnaround or a long-term plan?";
        break;

      case 'timeline':
        await prisma.lead.update({
          where: { conversationId },
          data: { sourcingTimeline: userMessage.content },
        });
        nextStage = 'contact';
        nextBotReply = "Great. I have all the sourcing details. Now, could you please provide your name, company, and email or phone number so we can get in touch?";
        break;

      case 'contact':
        const nameMatch = userMessage.content.match(/name is (.+?)(,|$)/i) || userMessage.content.match(/^(.+?)(,|$)/);
        const emailMatch = userMessage.content.match(/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/i);
        const phoneMatch = userMessage.content.match(/\b\d{10,}\b/);
        const companyMatch = userMessage.content.match(/company (.+?)(,|$)/i);

        await prisma.lead.update({
          where: { conversationId },
          data: {
            name: nameMatch ? nameMatch[1].trim() : null,
            email: emailMatch ? emailMatch[0].trim() : null,
            phone: phoneMatch ? phoneMatch[0].trim() : null,
            company: companyMatch ? companyMatch[1].trim() : null,
          },
        });

        nextStage = 'schedule';
        nextBotReply = "Thank you! I've captured your details. Would you like to schedule a call with the Kaiz La team to discuss your sourcing needs in more detail?";
        break;

      case 'schedule':
        const wantsCall = userMessage.content.toLowerCase().includes('yes') ||
                         userMessage.content.toLowerCase().includes('sure') ||
                         userMessage.content.toLowerCase().includes('ok');

        await prisma.lead.update({
          where: { conversationId },
          data: { scheduledCall: wantsCall },
        });

        if (wantsCall) {
          nextStage = 'completed';
          nextBotReply = "Perfect! Someone from our team will reach out to you within 24 hours to schedule a call. In the meantime, feel free to ask me any questions about our sourcing services.";
        } else {
          nextStage = 'completed';
          nextBotReply = "No problem! We have your information and will follow up via email. Feel free to ask me any questions about our sourcing services anytime.";
        }
        break;

      default:
        const ragResponse = await handleRAG(userMessage.content);
        const nextQuestionDefault = getQualificationQuestion(conversation.stage);
        
        let ragResponseTextDefault = "";
        if (ragResponse.body) {
            const reader = ragResponse.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                ragResponseTextDefault += decoder.decode(value);
            }
        }
        
        return new NextResponse(`${ragResponseTextDefault}\n\n${nextQuestionDefault}`);
    }

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { stage: nextStage },
    });

    if (trustBuildingReply) {
      nextBotReply = `${trustBuildingReply}\n\n${nextBotReply}`;
    }

    return new NextResponse(nextBotReply);
  } catch (error) {
    console.error('Chat processing error:', error);
    return new NextResponse("I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.");
  }
}