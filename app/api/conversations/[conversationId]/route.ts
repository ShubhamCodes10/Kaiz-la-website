import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { conversationId } = await context.params;

    if (!conversationId) {
      return NextResponse.json(
        { message: "Conversation Id not found" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: { createdAt: "asc" },
    });

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
    const { conversationId } = await context.params;

    if (!conversationId) {
      return NextResponse.json(
        { message: "Conversation Id not found" },
        { status: 404 }
      );
    }

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