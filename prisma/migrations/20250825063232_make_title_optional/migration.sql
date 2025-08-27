-- AlterTable
ALTER TABLE "public"."Conversation" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "title" DROP DEFAULT;
