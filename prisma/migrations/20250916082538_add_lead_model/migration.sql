-- AlterTable
ALTER TABLE "public"."Conversation" ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'greeting';

-- CreateTable
CREATE TABLE "public"."Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "productInterest" TEXT,
    "orderVolume" TEXT,
    "preferredRegion" TEXT,
    "sourcingTimeline" TEXT,
    "scheduledCall" BOOLEAN NOT NULL DEFAULT false,
    "callDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_conversationId_key" ON "public"."Lead"("conversationId");

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
