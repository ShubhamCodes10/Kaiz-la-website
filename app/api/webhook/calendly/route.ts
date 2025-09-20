import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest){
    try {
        const event = await req.json();
        if(!event){
            return NextResponse.json({
                message: "No Event found",
                status: 400
            })
        }

        if(event.event === 'invitee.created'){
            const inviteeEmail = event.payload.email;
            const eventStartTime = new Date(event.payload.scheduled_event.start_time);

            const lead = await prisma.lead.findFirst({
                where: {email: inviteeEmail as string}
            });

            if(lead){
                await prisma.lead.update({
                    where: {id: lead.id},
                    data: {
                        scheduledCall: true,
                        callDate: eventStartTime
                    }
                })
            }
        }

        return NextResponse.json({
            status: 'success'
        })
     } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}