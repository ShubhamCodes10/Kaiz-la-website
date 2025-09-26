import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, content, role, conversationId, createdAt } = body;

    if (!id || !content || !role || !conversationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.conversation.upsert({
      where: { id: conversationId },
      update: {}, 
      create: {   
        id: conversationId,
        title: content.substring(0, 25), 
      }
    });

    const newMessage = await prisma.message.create({
      data: {
        id,
        content,
        role,
        conversationId,
        createdAt,
      },
    });
    
    const messagesCacheKey = `messages:${conversationId}`;
    const allConvosCacheKey = `all-conversations`;

    await redis.del(messagesCacheKey);
    await redis.del(allConvosCacheKey);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}