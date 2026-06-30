-- CreateTable
CREATE TABLE "calculation_histories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "label" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calculation_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "calculation_histories_user_id_idx" ON "calculation_histories"("user_id");

-- CreateIndex
CREATE INDEX "calculation_histories_createdAt_idx" ON "calculation_histories"("createdAt");

-- AddForeignKey
ALTER TABLE "calculation_histories" ADD CONSTRAINT "calculation_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
