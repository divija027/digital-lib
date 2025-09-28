/*
  Warnings:

  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."resources" DROP CONSTRAINT "resources_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."resources" DROP CONSTRAINT "resources_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."resources" DROP CONSTRAINT "resources_uploadedBy_fkey";

-- DropTable
DROP TABLE "public"."resources";

-- DropEnum
DROP TYPE "public"."ResourceType";
