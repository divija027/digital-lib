/*
  Warnings:

  - A unique constraint covering the columns `[homePreviewPosition]` on the table `mcq_sets` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mcq_sets" ADD COLUMN     "homePreviewPosition" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "mcq_sets_homePreviewPosition_key" ON "mcq_sets"("homePreviewPosition");
