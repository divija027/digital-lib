/*
  Warnings:

  - You are about to drop the `site_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "pdfs" ADD COLUMN IF NOT EXISTS "publicUrl" TEXT;

-- DropTable (conditional - only drop if exists)
DROP TABLE IF EXISTS "public"."site_settings";
