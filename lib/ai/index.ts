import * as openai from './openai'
import * as gemini from './gemini'

const provider = process.env.LLM_PROVIDER

const aiProvider = provider === 'openai' ? openai : gemini;

export const embedQuery = aiProvider.embedQuery;
export const generateChatResponse = aiProvider.generateChatResponse;
export const generateTitle = aiProvider.generateTitle;