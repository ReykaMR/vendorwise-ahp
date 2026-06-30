import prisma from "@/lib/prisma";
import type {
  CriteriaPriority,
  SupplierPriority,
} from "@/app/generated/prisma/client";

export const priorityRepository = {
  // ---- Criteria Priority ----

  async findByUser(
    userId: string,
  ): Promise<
    (CriteriaPriority & { criteria: { id: string; name: string } })[]
  > {
    return prisma.criteriaPriority.findMany({
      where: { userId },
      include: { criteria: { select: { id: true, name: true } } },
    });
  },

  async upsertCriteria(
    userId: string,
    criteriaId: string,
    priority: number,
    consistencyRatio?: number,
  ): Promise<CriteriaPriority> {
    return prisma.criteriaPriority.upsert({
      where: {
        userId_criteriaId: { userId, criteriaId },
      },
      create: {
        userId,
        criteriaId,
        priority,
        consistencyRatio,
      },
      update: {
        priority,
        consistencyRatio,
      },
    });
  },

  async deleteCriteriaByUser(userId: string): Promise<number> {
    const result = await prisma.criteriaPriority.deleteMany({
      where: { userId },
    });
    return result.count;
  },

  // ---- Supplier Priority ----

  async findSupplierByUser(
    userId: string,
  ): Promise<
    (SupplierPriority & {
      criteria: { name: string };
      supplier: { name: string };
    })[]
  > {
    return prisma.supplierPriority.findMany({
      where: { userId },
      include: {
        criteria: { select: { name: true } },
        supplier: { select: { name: true } },
      },
    });
  },

  async findSupplierByUserAndCriteria(
    userId: string,
    criteriaId: string,
  ): Promise<SupplierPriority[]> {
    return prisma.supplierPriority.findMany({
      where: { userId, criteriaId },
    });
  },

  async upsertSupplier(
    userId: string,
    criteriaId: string,
    supplierId: string,
    priority: number,
    consistencyRatio?: number,
  ): Promise<SupplierPriority> {
    return prisma.supplierPriority.upsert({
      where: {
        userId_criteriaId_supplierId: { userId, criteriaId, supplierId },
      },
      create: {
        userId,
        criteriaId,
        supplierId,
        priority,
        consistencyRatio,
      },
      update: {
        priority,
        consistencyRatio,
      },
    });
  },

  async deleteSupplierByUserAndCriteria(
    userId: string,
    criteriaId: string,
  ): Promise<number> {
    const result = await prisma.supplierPriority.deleteMany({
      where: { userId, criteriaId },
    });
    return result.count;
  },
};
