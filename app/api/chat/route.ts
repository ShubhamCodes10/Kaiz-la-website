import { pineconeIndex } from '@/lib/pinecone';
import { prisma } from '@/lib/prisma';
import { embedQuery, generateChatResponse, generateTitle } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !conversationId) {
      return NextResponse.json(
        { error: "Missing messages or conversationId" },
        { status: 400 }
      );
    }
    const userMessage = messages[messages.length - 1];
    const isNewMessage = messages.length === 1;

    if(isNewMessage){
      const title = await generateTitle(userMessage.content)
      await prisma.conversation.create({
        data: {
          id: conversationId,
          title: title
        }
      })
    }else{
    await prisma.conversation.upsert({
      where: { id: conversationId },
      update: {},
      create: { id: conversationId },
    });
  }

    await prisma.message.create({
      data: {
        content: userMessage.content,
        role: 'user',
        conversationId: conversationId,
      },
    });

    const vector = await embedQuery(userMessage.content);
    const queryResponse = await pineconeIndex.query({
      topK: 3,
      vector,
      includeMetadata: true, 
    });

    // --- IMPROVEMENT 1: Filter results by a similarity score threshold ---
    const MIN_SCORE = 0.7;
    const filteredMatches = queryResponse.matches.filter(
      (match) => match.score && match.score > MIN_SCORE
    );

    const context = filteredMatches.map((m) => m.metadata?.text).join('\n\n');

    // --- ADD THIS LOG FOR DEBUGGING ---
    console.log('Pinecone Query Response:', queryResponse);
    console.log('Filtered Context:', context);
    // ------------------------------------

    // --- IMPROVEMENT 2: A more robust system prompt ---
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

    return await generateChatResponse(messages, systemPrompt);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}