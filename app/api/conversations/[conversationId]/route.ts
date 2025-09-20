import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

const CACHE_TTL = 60 * 5; 

type RouteContext = {
  params: { conversationId: string };
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { conversationId } = context.params;

    if (!conversationId) {
      return NextResponse.json(
        { message: "Conversation Id not found" },
        { status: 400 }
      );
    }
    
    const cacheKey = `messages:${conversationId}`;
    const cachedMessages = await redis.get(cacheKey);

    if (cachedMessages) {
      return NextResponse.json(cachedMessages);
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: { createdAt: "asc" },
    });

    if (messages) {
        await redis.set(cacheKey, messages, { ex: CACHE_TTL });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { conversationId } = context.params;

    if (!conversationId) {
      return NextResponse.json(
        { message: "Conversation Id not found" },
        { status: 404 }
      );
    }
    
    const cacheKey = `messages:${conversationId}`;
    await redis.del(cacheKey);
    
    const allConvosCacheKey = `all-conversations`;
    await redis.del(allConvosCacheKey);

    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { conversationId: conversationId },
      }),
      prisma.conversation.delete({ 
        where: { id: conversationId },
      }),
    ]);

    return NextResponse.json(
      { message: "Conversation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting conversation", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}