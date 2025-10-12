-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "logoUrl" TEXT,
    "logoR2Key" TEXT,
    "siteName" TEXT NOT NULL DEFAULT 'BrainReef',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);
