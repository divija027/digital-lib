-- CreateTable
CREATE TABLE "pdfs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "r2Key" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "subjectId" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pdfs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pdfs_r2Key_key" ON "pdfs"("r2Key");

-- CreateIndex
CREATE INDEX "pdfs_branch_semester_idx" ON "pdfs"("branch", "semester");

-- CreateIndex
CREATE INDEX "pdfs_subjectId_idx" ON "pdfs"("subjectId");

-- AddForeignKey
ALTER TABLE "pdfs" ADD CONSTRAINT "pdfs_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
