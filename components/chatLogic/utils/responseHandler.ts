import { NextResponse } from 'next/server';

export async function readStreamResponse(response: NextResponse): Promise<string> {
  let responseText = "";
  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      responseText += decoder.decode(value);
    }
  }
  return responseText;
}