-- CreateTable
CREATE TABLE "AnalysisSnapshot" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL DEFAULT 'preliminary-site-score',
    "methodologyVersion" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "coveragePercent" INTEGER NOT NULL,
    "confidence" TEXT NOT NULL,
    "band" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalysisSnapshot_projectId_createdAt_idx" ON "AnalysisSnapshot"("projectId", "createdAt");

-- AddForeignKey
ALTER TABLE "AnalysisSnapshot" ADD CONSTRAINT "AnalysisSnapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
