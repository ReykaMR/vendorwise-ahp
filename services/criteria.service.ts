import { criteriaRepository } from "@/repositories/criteria.repository";
import { Prisma } from "@/app/generated/prisma/client";

type CriteriaFlat = Pick<
  Prisma.CriteriaModel,
  "id" | "name" | "description" | "level" | "parentId" | "createdAt"
>;

type CriteriaTreeNode = CriteriaFlat & { children: CriteriaTreeNode[] };

export const criteriaService = {
  async list(): Promise<CriteriaFlat[]> {
    return criteriaRepository.findAll();
  },

  async getById(id: string) {
    return criteriaRepository.findById(id);
  },

  async getTree(): Promise<CriteriaTreeNode[]> {
    const all = await criteriaRepository.findAll();
    const map = new Map<string, CriteriaTreeNode>();
    const roots: CriteriaTreeNode[] = [];

    for (const item of all) {
      map.set(item.id, { ...item, children: [] });
    }

    for (const item of all) {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children.push(node);
      } else if (!item.parentId) {
        roots.push(node);
      }
    }

    return roots;
  },

  async create(data: {
    name: string;
    description?: string;
    parentId?: string;
  }) {
    let level = 0;

    if (data.parentId) {
      const parent = await criteriaRepository.findById(data.parentId);
      if (parent) {
        level = parent.level + 1;
      }
    }

    const existing = await criteriaRepository.findByNameAndParent(
      data.name,
      data.parentId || null,
    );
    if (existing) {
      throw new Error("Nama kriteria sudah ada di level ini");
    }

    return criteriaRepository.create({
      name: data.name,
      description: data.description || undefined,
      level,
      parentId: data.parentId || null,
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      parentId?: string;
    },
  ) {
    if (data.name && data.parentId !== undefined) {
      const existing = await criteriaRepository.findByNameAndParent(
        data.name,
        data.parentId || null,
      );
      if (existing && existing.id !== id) {
        throw new Error("Nama kriteria sudah ada di level ini");
      }
    }

    if (data.name && data.parentId === undefined) {
      const current = await criteriaRepository.findById(id);
      if (current) {
        const existing = await criteriaRepository.findByNameAndParent(
          data.name,
          current.parentId,
        );
        if (existing && existing.id !== id) {
          throw new Error("Nama kriteria sudah ada di level ini");
        }
      }
    }

    const updateData: {
      name?: string;
      description?: string;
      parentId?: string | null;
      level?: number;
    } = {};
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;

    if (data.parentId !== undefined) {
      updateData.parentId = data.parentId || null;
      if (data.parentId) {
        const parent = await criteriaRepository.findById(data.parentId);
        if (parent) {
          updateData.level = parent.level + 1;
        }
      } else {
        updateData.level = 0;
      }
    }

    return criteriaRepository.update(id, updateData);
  },

  async delete(id: string) {
    const children = await criteriaRepository.findChildren(id);
    if (children.length > 0) {
      throw new Error(
        `Kriteria ini memiliki ${children.length} sub-kriteria. Hapus sub-kriteria terlebih dahulu.`,
      );
    }
    return criteriaRepository.delete(id);
  },

  async getAvailableParents(excludeId?: string): Promise<CriteriaFlat[]> {
    const all = await criteriaRepository.findAll();
    return all.filter((c) => c.id !== excludeId);
  },
};
