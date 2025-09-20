import { embedQuery } from '@/lib/ai';
import { delay } from '../utils/helpers';
import { EMBEDDING_RETRY_DELAY, MAX_EMBEDDING_RETRIES } from '../utils/constants';

export async function embedWithRetry(text: string, retries: number = 0): Promise<number[] | null> {
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