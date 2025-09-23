import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';
import { pineconeIndex } from '@/lib/pinecone';
import { embedWithRetry } from './embedding';
import { MIN_RAG_SCORE } from '../utils/constants';
import { readStreamResponse } from '../utils/responseHandler';

export async function handleRAG(userMessageContent: string, addFollowUpQuestion: boolean = false): Promise<NextResponse> {
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

    const filteredMatches = queryResponse.matches.filter(
      (match) => match.score && match.score > MIN_RAG_SCORE
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
    const responseText = await readStreamResponse(new NextResponse(responseStream.body));
    
    let finalResponse = responseText;
    if (addFollowUpQuestion) {
      const nextQuestion = "To help find the best options, could you tell me what product you are looking to source?";
      finalResponse += `\n\n${nextQuestion}`;
    }

    return new NextResponse(finalResponse);
  } catch (error) {
    console.error('RAG handling failed:', error);
    const fallbackText = "I apologize, but I'm experiencing some technical difficulties. Please feel free to ask me any other questions, or we can continue with the sourcing questions.";
    return new NextResponse(fallbackText);
  }
}