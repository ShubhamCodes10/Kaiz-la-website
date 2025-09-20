import { NextRequest, NextResponse } from 'next/server';
import { processChatRequest } from '@/components/chatLogic';

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !conversationId) {
      return NextResponse.json(
        { error: "Missing messages or conversationId" },
        { status: 400 }
      );
    }
    
    const response = await processChatRequest(messages, conversationId);
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}