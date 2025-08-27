import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        if(!conversations){
            return NextResponse.json({
                message: "No Conversation found",
                status: 404
            })
        }

        return NextResponse.json(conversations);
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error",
            status: 500
        })
    }
}