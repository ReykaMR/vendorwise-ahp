import prisma from "@/lib/prisma";

export const historyRepository = {
  async create(userId: string, data: Record<string, unknown>, label?: string) {
    const count = await prisma.calculationHistory.count({
      where: { userId },
    });
    return prisma.calculationHistory.create({
      data: {
        userId,
        label: label ?? `Perhitungan #${count + 1}`,
        data: data as PrismaInputJson,
      },
    });
  },

  async findByUser(userId: string) {
    return prisma.calculationHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        label: true,
        createdAt: true,
        data: true,
      },
    });
  },

  async findById(id: string, userId: string) {
    return prisma.calculationHistory.findFirst({
      where: { id, userId },
    });
  },

  async deleteMany(ids: string[], userId: string) {
    return prisma.calculationHistory.deleteMany({
      where: { id: { in: ids }, userId },
    });
  },

  async delete(id: string, userId: string) {
    return prisma.calculationHistory.deleteMany({
      where: { id, userId },
    });
  },

  async updateLabel(id: string, userId: string, label: string) {
    return prisma.calculationHistory.updateMany({
      where: { id, userId },
      data: { label },
    });
  },
};

type PrismaInputJson = Parameters<
  typeof prisma.calculationHistory.create
>[0]["data"]["data"];
