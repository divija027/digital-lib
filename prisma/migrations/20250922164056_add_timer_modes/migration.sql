/*
  Warnings:

  - You are about to drop the column `timeLimit` on the `mcq_sets` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TimerMode" AS ENUM ('TOTAL_TIME', 'PER_QUESTION');

-- AlterTable
ALTER TABLE "public"."mcq_sets" DROP COLUMN "timeLimit",
ADD COLUMN     "questionTimeLimit" INTEGER,
ADD COLUMN     "timerMode" "public"."TimerMode" NOT NULL DEFAULT 'TOTAL_TIME',
ADD COLUMN     "totalTimeLimit" INTEGER;
