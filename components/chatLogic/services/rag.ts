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
    You are KaiExpert, a professional and helpful AI assistant for Kaiz La, a sourcing-as-a-service company. A user is asking a question.

    Your primary goal is to answer the user's question based on the provided text chunks from the Kaiz La knowledge base.

    RULES:
    1. First, carefully examine the provided text chunks.
    2. If the answer is available in the chunks, you MUST base your response on that information.
    3. If the provided chunks do not contain a relevant answer to the user's question, you may then use your general knowledge to provide a helpful response.
    4. Always maintain a professional, helpful, and customer-first tone.
    5. Do not mention the words "context" or "chunks" in your final answer.

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