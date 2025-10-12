-- AlterTable
ALTER TABLE "mcq_sets" ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "showInHomePreview" BOOLEAN NOT NULL DEFAULT false;
