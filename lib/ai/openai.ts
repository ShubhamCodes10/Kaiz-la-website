import { createOpenAI } from '@ai-sdk/openai';
import { streamText, embed, generateText } from 'ai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embedQuery(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding('text-embedding-3-small'), 
    value: text,
  });
  return embedding;
}

export async function generateChatResponse(messages: any[], systemPrompt: string) {
  const result = await streamText({
    model: openai('gpt-4o'),
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
    model: openai('gpt-3.5-turbo'), 
    prompt: prompt,
    maxOutputTokens: 15,
  });

  return title.trim().replace(/"/g, '');
}