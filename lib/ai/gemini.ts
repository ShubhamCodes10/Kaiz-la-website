import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, embed, generateText  } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

//  * Job 1: Create a vector embedding from a piece of text using the Vercel AI SDK.

export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: google.embedding('embedding-001'), 
    value: text,
  });
  return embedding;
}

/**
 * Job 2: Generate a streaming chat response. (No changes here)
 */
export async function generateChatResponse(messages: any[], systemPrompt: string) {
  const result = await streamText({
    model: google('gemini-1.5-flash-latest'),
    system: systemPrompt,
    messages: messages,
  });
  return result.toTextStreamResponse();
}

export async function generateTitle(text: string): Promise<string> {
  const prompt = `Based on the following user message, create a short, concise title (4 words maximum) for this conversation.

  MESSAGE: "${text}"
  
  TITLE:`;

  const { text: title } = await generateText({
    model: google('gemini-1.5-flash-latest'),
    prompt: prompt,
    maxOutputTokens: 15
  });

  return title.trim().replace(/"/g, ''); 
}