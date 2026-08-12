CREATE TABLE "AgentDocument" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AgentDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AgentDocumentChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "AgentDocumentChunk_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AgentDocument_projectId_createdAt_idx" ON "AgentDocument"("projectId", "createdAt");
CREATE UNIQUE INDEX "AgentDocumentChunk_documentId_ordinal_key" ON "AgentDocumentChunk"("documentId", "ordinal");
CREATE INDEX "AgentDocumentChunk_documentId_idx" ON "AgentDocumentChunk"("documentId");

ALTER TABLE "AgentDocument" ADD CONSTRAINT "AgentDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgentDocumentChunk" ADD CONSTRAINT "AgentDocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "AgentDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;
