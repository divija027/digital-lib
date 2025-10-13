/*
  Warnings:

  - You are about to drop the `site_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "pdfs" ADD COLUMN     "publicUrl" TEXT;

-- DropTable
DROP TABLE "public"."site_settings";
