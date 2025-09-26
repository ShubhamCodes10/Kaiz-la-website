import { createOpenAI } from '@ai-sdk/openai';
import { streamText, embed, generateText } from 'ai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function embedQuery(text: string): Promise<number[]> {
  const { embedding, usage } = await embed({
    model: openai.embedding('text-embedding-3-small'),
    value: text,
  });
  console.log('Embedding Token Usage:', usage);
  return embedding;
}

export async function generateChatResponse(messages: any[], systemPrompt: string) {
  const result = await streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: messages,
    maxOutputTokens: 512,
  });
  
  result.usage.then(usage => {
    console.log('Chat Generation Token Usage:', usage);
  });

  return result.toTextStreamResponse();
}

export async function generateTitle(text: string): Promise<string> {
  const prompt = `Based on the following user message, create a short, concise title (4 words maximum) for this conversation.

  MESSAGE: "${text}"
  
  TITLE:`;

  const { text: title, usage } = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: prompt,
    maxOutputTokens: 20,
  });
  console.log('Title Generation Token Usage:', usage);
  return title.trim().replace(/"/g, '');
}