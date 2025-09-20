import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, embed, generateText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const RATE_LIMIT_DELAY = 2000;
let lastEmbedTime = 0;
let lastGenerateTime = 0;

export async function embedQuery(text: string): Promise<number[]> {
  const now = Date.now();
  const timeSinceLastEmbed = now - lastEmbedTime;

  if (timeSinceLastEmbed < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastEmbed));
  }

  try {
    const { embedding, usage } = await embed({
      model: google.embedding('embedding-001'),
      value: text,
    });
    console.log('Embedding API Usage:', usage);

    lastEmbedTime = Date.now();
    return embedding;
  } catch (error: any) {
    if (error?.statusCode === 429) {
      const retryAfter = error?.headers?.['retry-after'] ? parseInt(error.headers['retry-after']) * 1000 : 60000;
      throw { statusCode: 429, message: error.message, retryAfter };
    }
    throw error;
  }
}

export async function generateChatResponse(messages: any[], systemPrompt: string) {
  const now = Date.now();
  const timeSinceLastGenerate = now - lastGenerateTime;

  if (timeSinceLastGenerate < 500) {
    await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLastGenerate));
  }

  try {
    const result = await streamText({
      model: google('gemini-1.5-flash-latest'),
      system: systemPrompt,
      messages: messages,
    });

    const finalResult = result.toTextStreamResponse();
    lastGenerateTime = Date.now();
    
    return finalResult;
  } catch (error: any) {
    if (error?.statusCode === 429) {
      throw { statusCode: 429, message: error.message };
    }
    throw error;
  }
}

export async function generateTitle(text: string): Promise<string> {
  const now = Date.now();
  const timeSinceLastGenerate = now - lastGenerateTime;

  if (timeSinceLastGenerate < 500) {
    await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLastGenerate));
  }

  const prompt = `Based on the following user message, create a short, concise title (4 words maximum) for this conversation.

  MESSAGE: "${text}"
  
  TITLE:`;

  try {
    const { text: title, usage } = await generateText({
      model: google('gemini-1.5-flash-latest'),
      prompt: prompt,
      maxOutputTokens: 15
    });
    console.log('Title Generation API Usage:', usage);

    lastGenerateTime = Date.now();
    return title.trim().replace(/"/g, '');
  } catch (error: any) {
    console.error('Title generation failed:', error);
    return 'New Conversation';
  }
}