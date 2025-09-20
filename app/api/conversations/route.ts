import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'
import redis from '@/lib/redis';

const CACHE_TTL = 60 * 5; 

export async function GET() {
    try {
        const cacheKey = 'all-conversations';
        const cachedConversations = await redis.get(cacheKey);

        if (cachedConversations) {
            return NextResponse.json(cachedConversations);
        }

        const conversations = await prisma.conversation.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });

        if (!conversations || conversations.length === 0) {
            return NextResponse.json({
                message: "No Conversation found",
                status: 404
            });
        }
        
        await redis.set(cacheKey, conversations, { ex: CACHE_TTL });

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Error fetching all conversations:", error);
        return NextResponse.json({
            message: "Internal Server Error",
            status: 500
        });
    }
}