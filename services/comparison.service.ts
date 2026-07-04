import { comparisonRepository } from "@/repositories/comparison.repository";
import { criteriaRepository } from "@/repositories/criteria.repository";
import { supplierRepository } from "@/repositories/supplier.repository";
import type {
  CriteriaComparison,
  SupplierComparison,
} from "@/app/generated/prisma/client";

type MatrixCell = {
  rowId: string;
  colId: string;
  value: number | null;
  isReadonly: boolean;
};

type CriteriaMatrix = {
  criteria: {
    id: string;
    name: string;
  }[];
  cells: MatrixCell[][];
};

type SupplierMatrix = {
  criteriaId: string;
  criteriaName: string;
  suppliers: {
    id: string;
    name: string;
  }[];
  cells: MatrixCell[][];
};

export const comparisonService = {
  // ---- Criteria Matrix ----

  async getMatrix(userId: string): Promise<CriteriaMatrix> {
    const allCriteria = await criteriaRepository.findRoots();
    const sorted = allCriteria
      .map((c) => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const existingComparisons =
      await comparisonRepository.findCriteriaByUser(userId);
    const comparisonMap = new Map<string, number>();
    for (const comp of existingComparisons) {
      const key = `${comp.criteria1Id}:${comp.criteria2Id}`;
      comparisonMap.set(key, comp.value);
    }

    const n = sorted.length;
    const cells: MatrixCell[][] = [];

    for (let i = 0; i < n; i++) {
      const row: MatrixCell[] = [];
      for (let j = 0; j < n; j++) {
        let value: number | null = null;
        let isReadonly = true;

        if (i === j) {
          value = 1;
          isReadonly = true;
        } else {
          const key =
            sorted[i].id < sorted[j].id
              ? `${sorted[i].id}:${sorted[j].id}`
              : `${sorted[j].id}:${sorted[i].id}`;
          const storedValue = comparisonMap.get(key);

          if (storedValue !== undefined) {
            value = sorted[i].id < sorted[j].id ? storedValue : 1 / storedValue;
          }

          isReadonly = sorted[i].id > sorted[j].id;
        }

        row.push({
          rowId: sorted[i].id,
          colId: sorted[j].id,
          value,
          isReadonly,
        });
      }
      cells.push(row);
    }

    return { criteria: sorted, cells };
  },

  async saveCriteriaCell(
    userId: string,
    criteria1Id: string,
    criteria2Id: string,
    value: number,
  ): Promise<CriteriaComparison> {
    const [first, second] =
      criteria1Id < criteria2Id
        ? [criteria1Id, criteria2Id]
        : [criteria2Id, criteria1Id];

    const storedValue = criteria1Id < criteria2Id ? value : 1 / value;

    return comparisonRepository.upsertCriteria(
      userId,
      first,
      second,
      storedValue,
    );
  },

  // ---- Supplier Matrix ----

  async getSupplierMatrix(
    userId: string,
    criteriaId: string,
  ): Promise<SupplierMatrix> {
    const [criteria, allSuppliers] = await Promise.all([
      criteriaRepository.findById(criteriaId),
      supplierRepository.findMany(),
    ]);

    if (!criteria) {
      throw new Error("Kriteria tidak ditemukan");
    }

    const sorted = allSuppliers
      .map((s) => ({ id: s.id, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const existingComparisons =
      await comparisonRepository.findSupplierByUserAndCriteria(
        userId,
        criteriaId,
      );
    const comparisonMap = new Map<string, number>();
    for (const comp of existingComparisons) {
      const key = `${comp.supplier1Id}:${comp.supplier2Id}`;
      comparisonMap.set(key, comp.value);
    }

    const n = sorted.length;
    const cells: MatrixCell[][] = [];

    for (let i = 0; i < n; i++) {
      const row: MatrixCell[] = [];
      for (let j = 0; j < n; j++) {
        let value: number | null = null;
        let isReadonly = true;

        if (i === j) {
          value = 1;
          isReadonly = true;
        } else {
          const key =
            sorted[i].id < sorted[j].id
              ? `${sorted[i].id}:${sorted[j].id}`
              : `${sorted[j].id}:${sorted[i].id}`;
          const storedValue = comparisonMap.get(key);

          if (storedValue !== undefined) {
            value = sorted[i].id < sorted[j].id ? storedValue : 1 / storedValue;
          }

          isReadonly = sorted[i].id > sorted[j].id;
        }

        row.push({
          rowId: sorted[i].id,
          colId: sorted[j].id,
          value,
          isReadonly,
        });
      }
      cells.push(row);
    }

    return {
      criteriaId: criteria.id,
      criteriaName: criteria.name,
      suppliers: sorted,
      cells,
    };
  },

  async saveSupplierCell(
    userId: string,
    criteriaId: string,
    supplier1Id: string,
    supplier2Id: string,
    value: number,
  ): Promise<SupplierComparison> {
    const [first, second] =
      supplier1Id < supplier2Id
        ? [supplier1Id, supplier2Id]
        : [supplier2Id, supplier1Id];

    const storedValue = supplier1Id < supplier2Id ? value : 1 / value;

    return comparisonRepository.upsertSupplier(
      userId,
      criteriaId,
      first,
      second,
      storedValue,
    );
  },
};
