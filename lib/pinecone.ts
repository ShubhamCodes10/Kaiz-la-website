import 'dotenv/config'; 

import { Pinecone } from '@pinecone-database/pinecone';


if (
  !process.env.PINECONE_API_KEY ||
  !process.env.PINECONE_ENVIRONMENT ||
  !process.env.PINECONE_INDEX_NAME
) {
  throw new Error('Pinecone environment variables are not set!');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Target the specific index
export const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);