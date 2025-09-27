import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai';
import { pineconeIndex } from '@/lib/pinecone';
import { embedWithRetry } from './embedding';
import { readStreamResponse } from '../utils/responseHandler';

export async function handleRAG(userMessageContent: string, addFollowUpQuestion: boolean = false): Promise<NextResponse> {
  try {
    const vector = await embedWithRetry(userMessageContent);

    if (!vector) {
      return new NextResponse("We can source a wide variety of products, from consumer goods to industrial components. To give you the best answer, it's helpful if you can tell me more about your specific needs.");
    }

    const queryResponse = await pineconeIndex.query({
      topK: 3,
      vector,
      includeMetadata: true,
    });

    const context = queryResponse.matches.map((m) => m.metadata?.text).join('\n\n');

    const systemPrompt = `
You are KaiExpert, a professional AI assistant for Kaiz La. You must respond in properly formatted Markdown for professional presentation.

**CRITICAL FORMATTING REQUIREMENTS:**

1. **Response Structure:**
   - Start with a brief introductory sentence (no bold formatting)
   - Use proper Markdown formatting throughout
   - Use proper spacing between sections

2. **For Lists and Key Points:**
   - Use bullet points with this exact format: "• **Title**: Description"
   - Each bullet point must start with the bullet symbol (•)
   - Bold the key term/title followed by a colon
   - Provide clear, concise descriptions
   - Add line breaks between bullet points for readability

3. **For General Information:**
   - Use well-structured paragraphs with proper spacing
   - Use **bold** for important terms or concepts
   - Use line breaks to separate ideas

4. **Professional Standards:**
   - No emojis
   - Concise but comprehensive responses
   - Use industry-appropriate terminology
   - Maintain helpful and informative tone

**EXAMPLE OUTPUT FORMAT:**

For lists:
Here's what you need to know about our sourcing capabilities:

• **Consumer Electronics**: Smartphones, tablets, and smart home devices from verified manufacturers
• **Industrial Components**: Machinery parts, sensors, and automation equipment with quality certifications  
• **Textiles & Apparel**: Custom clothing, fabrics, and accessories with flexible MOQ options

For general responses:
Our sourcing network spans multiple industries with **established partnerships** across Asia-Pacific regions. 

We specialize in **quality verification** and **supply chain optimization** to ensure reliable delivery timelines.

USER QUESTION: "${userMessageContent}"

CONTEXT: ${context || 'No relevant context found.'}

Respond using the exact formatting requirements above. Base your answer on the provided context when relevant, otherwise use your general knowledge about sourcing and supply chain management.
    `;

    const responseStream = await generateChatResponse([{ role: 'user', content: userMessageContent }], systemPrompt);
    const responseText = await readStreamResponse(new NextResponse(responseStream.body));

    let finalResponse = responseText.trim();

    if (addFollowUpQuestion) {
      const nextQuestion = "What specific product are you looking to source?";
      finalResponse += `\n\n${nextQuestion}`;
    }

    return new NextResponse(finalResponse);
  } catch (error) {
    console.error('RAG handling failed:', error);
    const fallbackText = `I apologize for the technical difficulty. Please feel free to ask me about:

• **Product Sourcing**: Information about available products and suppliers
• **Supply Chain**: Logistics and delivery timelines  
• **Quality Assurance**: Certification and verification processes

What specific product are you looking to source?`;
    return new NextResponse(fallbackText);
  }
}