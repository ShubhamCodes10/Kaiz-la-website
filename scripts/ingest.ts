import 'dotenv/config'; 
import { pineconeIndex } from '@/lib/pinecone';
import { embedQuery } from '@/lib/ai';
import fs from 'fs/promises';

/**
 * Splits a long text into smaller chunks of a specified size.
 * @param text The source text to split.
 * @param chunkSize The maximum number of characters in each chunk.
 * @param chunkOverlap The number of characters to overlap between chunks to maintain context.
 * @returns An array of text chunks.
 */
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

/**
 * The main function to process and upload the knowledge base to Pinecone.
 */
async function ingestData() {
  try {
    // 1. Load the knowledge base from the text file.
    const text = await fs.readFile('data/knowledge.txt', 'utf-8');

    // 2. Split the text into smaller, manageable chunks.
    const chunks = splitTextIntoChunks(text, 1000, 100);
    console.log(`Split text into ${chunks.length} chunks.`);

    console.log(`Embedding chunks using the '${process.env.LLM_PROVIDER}' provider...`);

    // 3. Process each chunk.
    for (const chunk of chunks) {
      // Create an embedding (a vector representation) of the chunk.
      const vector = await embedQuery(chunk);

      // Upload the vector and the original text to Pinecone.
      await pineconeIndex.upsert([{
        id: crypto.randomUUID(), // Generate a unique ID for each vector.
        values: vector,
        metadata: { text: chunk }, // Store the original text as metadata.
      }]);
    }

    console.log('✅ Ingestion complete!');

  } catch (error) {
    console.error('❌ Ingestion failed:', error);
  }
}

// Run the ingestion process.
ingestData();