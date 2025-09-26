import 'dotenv/config'; 
import { pineconeIndex } from '../lib/pinecone.js';
import { embedQuery } from '../lib/ai/index.js';
import fs from 'fs/promises';

function splitTextIntoChunks(text: string, chunkSize: number, chunkOverlap: number): string[] {
  if (chunkOverlap >= chunkSize) {
    throw new Error('chunkOverlap must be less than chunkSize.');
  }
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = i + chunkSize;
    chunks.push(text.slice(i, end));
    i += chunkSize - chunkOverlap;
  }
  return chunks;
}

async function ingestData() {
  try {
    const text = await fs.readFile('data/knowledge.txt', 'utf-8');
    const chunks = splitTextIntoChunks(text, 300, 50);
    console.log(`Split text into ${chunks.length} chunks.`);
    console.log(`Embedding chunks using the '${process.env.LLM_PROVIDER}' provider...`);

    const pineconeVectors = [];
    for (const chunk of chunks) {
      const vector = await embedQuery(chunk);
      pineconeVectors.push({
        id: crypto.randomUUID(),
        values: vector,
        metadata: { text: chunk },
      });
    }

    const BATCH_SIZE = 100;
    for (let i = 0; i < pineconeVectors.length; i += BATCH_SIZE) {
      const batch = pineconeVectors.slice(i, i + BATCH_SIZE);
      await pineconeIndex.upsert(batch);
    }

    console.log('Ingestion complete!');
  } catch (error) {
    console.error('Ingestion failed:', error);
  }
}

ingestData();