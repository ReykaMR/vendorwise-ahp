import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";

export const criteriaRepository = {
  async findAll(): Promise<
    Pick<
      Prisma.CriteriaModel,
      "id" | "name" | "description" | "level" | "parentId" | "createdAt"
    >[]
  > {
    return prisma.criteria.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        level: true,
        parentId: true,
        createdAt: true,
      },
      orderBy: [{ level: "asc" }, { name: "asc" }],
    });
  },

  async findById(id: string) {
    return prisma.criteria.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        level: true,
        parentId: true,
        createdAt: true,
      },
    });
  },

  async findRoots() {
    return prisma.criteria.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        description: true,
        level: true,
        parentId: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async findChildren(parentId: string) {
    return prisma.criteria.findMany({
      where: { parentId },
      select: {
        id: true,
        name: true,
        description: true,
        level: true,
        parentId: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  },

  async findByNameAndParent(name: string, parentId: string | null) {
    return prisma.criteria.findFirst({
      where: { name, parentId },
    });
  },

  async create(data: {
    name: string;
    description?: string;
    level: number;
    parentId?: string | null;
  }) {
    return prisma.criteria.create({ data });
  },

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      level?: number;
      parentId?: string | null;
    },
  ) {
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.level !== undefined) updateData.level = data.level;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    return prisma.criteria.update({ where: { id }, data: updateData });
  },

  async delete(id: string) {
    return prisma.criteria.delete({ where: { id } });
  },
};
