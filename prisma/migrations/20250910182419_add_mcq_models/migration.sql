-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "public"."MCQStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."mcq_sets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL,
    "category" TEXT NOT NULL,
    "timeLimit" INTEGER NOT NULL DEFAULT 30,
    "tags" TEXT[],
    "companies" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."MCQStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "mcq_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mcq_questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" INTEGER NOT NULL,
    "explanation" TEXT,
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mcqSetId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "mcq_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mcq_attempts" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mcqSetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "mcq_attempts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."mcq_sets" ADD CONSTRAINT "mcq_sets_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mcq_questions" ADD CONSTRAINT "mcq_questions_mcqSetId_fkey" FOREIGN KEY ("mcqSetId") REFERENCES "public"."mcq_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mcq_questions" ADD CONSTRAINT "mcq_questions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mcq_attempts" ADD CONSTRAINT "mcq_attempts_mcqSetId_fkey" FOREIGN KEY ("mcqSetId") REFERENCES "public"."mcq_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mcq_attempts" ADD CONSTRAINT "mcq_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
