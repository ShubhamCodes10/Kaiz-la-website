"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pineconeIndex = void 0;
require("dotenv/config");
var pinecone_1 = require("@pinecone-database/pinecone");
if (!process.env.PINECONE_API_KEY ||
    !process.env.PINECONE_ENVIRONMENT ||
    !process.env.PINECONE_INDEX_NAME) {
    throw new Error('Pinecone environment variables are not set!');
}
var pinecone = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
// Target the specific index
exports.pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME);
