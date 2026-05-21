-- CreateTable
CREATE TABLE "RealtimeEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'public',
    "entityType" TEXT,
    "entityId" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RealtimeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RealtimeEvent_createdAt_idx" ON "RealtimeEvent"("createdAt");

-- CreateIndex
CREATE INDEX "RealtimeEvent_type_idx" ON "RealtimeEvent"("type");

-- CreateIndex
CREATE INDEX "RealtimeEvent_audience_createdAt_idx" ON "RealtimeEvent"("audience", "createdAt");

-- CreateIndex
CREATE INDEX "RealtimeEvent_entityType_entityId_idx" ON "RealtimeEvent"("entityType", "entityId");
