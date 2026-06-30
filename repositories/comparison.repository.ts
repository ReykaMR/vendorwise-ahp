import prisma from "@/lib/prisma";
import type { CriteriaComparison } from "@/app/generated/prisma/client";

export const comparisonRepository = {
  async findByUser(userId: string): Promise<CriteriaComparison[]> {
    return prisma.criteriaComparison.findMany({
      where: { userId },
    });
  },

  async upsert(
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

  async deleteManyForUser(userId: string): Promise<number> {
    const result = await prisma.criteriaComparison.deleteMany({
      where: { userId },
    });
    return result.count;
  },
};
