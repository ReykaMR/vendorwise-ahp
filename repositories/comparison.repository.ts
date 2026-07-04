import prisma from "@/lib/prisma";
import type {
  CriteriaComparison,
  SupplierComparison,
} from "@/app/generated/prisma/client";

export const comparisonRepository = {
  // ---- Criteria Comparison ----

  async findCriteriaByUser(userId: string): Promise<CriteriaComparison[]> {
    return prisma.criteriaComparison.findMany({
      where: { userId },
    });
  },

  async upsertCriteria(
    userId: string,
    criteria1Id: string,
    criteria2Id: string,
    value: number,
  ): Promise<CriteriaComparison> {
    return prisma.criteriaComparison.upsert({
      where: {
        userId_criteria1Id_criteria2Id: {
          userId,
          criteria1Id,
          criteria2Id,
        },
      },
      create: {
        userId,
        criteria1Id,
        criteria2Id,
        value,
      },
      update: {
        value,
      },
    });
  },

  // ---- Supplier Comparison ----

  async findSupplierByUserAndCriteria(
    userId: string,
    criteriaId: string,
  ): Promise<SupplierComparison[]> {
    return prisma.supplierComparison.findMany({
      where: { userId, criteriaId },
    });
  },

  async upsertSupplier(
    userId: string,
    criteriaId: string,
    supplier1Id: string,
    supplier2Id: string,
    value: number,
  ): Promise<SupplierComparison> {
    return prisma.supplierComparison.upsert({
      where: {
        userId_criteriaId_supplier1Id_supplier2Id: {
          userId,
          criteriaId,
          supplier1Id,
          supplier2Id,
        },
      },
      create: {
        userId,
        criteriaId,
        supplier1Id,
        supplier2Id,
        value,
      },
      update: {
        value,
      },
    });
  },
};
