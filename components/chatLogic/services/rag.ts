import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';
import { pineconeIndex } from '@/lib/pinecone';
import { embedWithRetry } from './embedding';
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

    const context = queryResponse.matches.map((m) => m.metadata?.text).join('\n\n---\n\n');

    const systemPrompt = `
    You are an expert assistant for Kaiz La. A user is asking a question.
    You will be provided with a few chunks of text from a knowledge base. Your task is to find the single chunk that contains the most relevant information to answer the user's question.

    RULES:
    1. First, carefully read the user's question and all the provided text chunks.
    2. Identify the single best chunk that directly answers the question.
    3. If you find a relevant chunk, use ONLY the information from that chunk to write a concise and accurate answer.
    4. If NONE of the chunks contain a relevant answer, you MUST respond with the exact phrase: "I'm sorry, I't have that information in my knowledge base."
    5. Do not make up information or use knowledge from outside the provided chunks.
    6. Do not mention the words "context" or "chunks" in your final answer.

    USER QUESTION:
    "${userMessageContent}"

    PROVIDED TEXT CHUNKS:
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