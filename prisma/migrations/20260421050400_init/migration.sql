-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "parent_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "contact_person" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria_comparisons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "criteria1_id" TEXT NOT NULL,
    "criteria2_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criteria_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_comparisons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "supplier1_id" TEXT NOT NULL,
    "supplier2_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criteria_priorities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,
    "consistency_ratio" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "criteria_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier_priorities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "priority" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplier_priorities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "criteria_parent_id_idx" ON "criteria"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "criteria_name_parent_id_key" ON "criteria"("name", "parent_id");

-- CreateIndex
CREATE INDEX "criteria_comparisons_user_id_idx" ON "criteria_comparisons"("user_id");

-- CreateIndex
CREATE INDEX "criteria_comparisons_criteria1_id_criteria2_id_idx" ON "criteria_comparisons"("criteria1_id", "criteria2_id");

-- CreateIndex
CREATE UNIQUE INDEX "criteria_comparisons_user_id_criteria1_id_criteria2_id_key" ON "criteria_comparisons"("user_id", "criteria1_id", "criteria2_id");

-- CreateIndex
CREATE INDEX "supplier_comparisons_user_id_idx" ON "supplier_comparisons"("user_id");

-- CreateIndex
CREATE INDEX "supplier_comparisons_criteria_id_idx" ON "supplier_comparisons"("criteria_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_comparisons_user_id_criteria_id_supplier1_id_suppl_key" ON "supplier_comparisons"("user_id", "criteria_id", "supplier1_id", "supplier2_id");

-- CreateIndex
CREATE INDEX "criteria_priorities_user_id_idx" ON "criteria_priorities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "criteria_priorities_user_id_criteria_id_key" ON "criteria_priorities"("user_id", "criteria_id");

-- CreateIndex
CREATE INDEX "supplier_priorities_user_id_idx" ON "supplier_priorities"("user_id");

-- CreateIndex
CREATE INDEX "supplier_priorities_criteria_id_idx" ON "supplier_priorities"("criteria_id");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_priorities_user_id_criteria_id_supplier_id_key" ON "supplier_priorities"("user_id", "criteria_id", "supplier_id");

-- AddForeignKey
ALTER TABLE "criteria" ADD CONSTRAINT "criteria_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_comparisons" ADD CONSTRAINT "criteria_comparisons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_comparisons" ADD CONSTRAINT "criteria_comparisons_criteria1_id_fkey" FOREIGN KEY ("criteria1_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_comparisons" ADD CONSTRAINT "criteria_comparisons_criteria2_id_fkey" FOREIGN KEY ("criteria2_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_comparisons" ADD CONSTRAINT "supplier_comparisons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_comparisons" ADD CONSTRAINT "supplier_comparisons_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_comparisons" ADD CONSTRAINT "supplier_comparisons_supplier1_id_fkey" FOREIGN KEY ("supplier1_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_comparisons" ADD CONSTRAINT "supplier_comparisons_supplier2_id_fkey" FOREIGN KEY ("supplier2_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_priorities" ADD CONSTRAINT "criteria_priorities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criteria_priorities" ADD CONSTRAINT "criteria_priorities_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_priorities" ADD CONSTRAINT "supplier_priorities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_priorities" ADD CONSTRAINT "supplier_priorities_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_priorities" ADD CONSTRAINT "supplier_priorities_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
