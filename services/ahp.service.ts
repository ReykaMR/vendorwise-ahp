import { criteriaRepository } from "@/repositories/criteria.repository";
import { supplierRepository } from "@/repositories/supplier.repository";
import { comparisonRepository } from "@/repositories/comparison.repository";
import { priorityRepository } from "@/repositories/priority.repository";
import { historyRepository } from "@/repositories/history.repository";
import { calculatePriorities } from "@/lib/ahp/priority";
import {
  calculateFinalScores,
  type SupplierScore,
} from "@/lib/ahp/final-score";
import type { ComparisonInput } from "@/lib/ahp/matrix";

export type AHPResult = {
  success: boolean;
  criteriaResult: {
    items: { id: string; name: string; priority: number }[];
    consistency: {
      lambdaMax: number;
      ci: number;
      ri: number;
      cr: number;
      isConsistent: boolean;
    };
  } | null;
  supplierResults: {
    criteriaId: string;
    criteriaName: string;
    items: { id: string; name: string; priority: number }[];
    consistency: {
      lambdaMax: number;
      ci: number;
      ri: number;
      cr: number;
      isConsistent: boolean;
    };
  }[];
  ranking: SupplierScore[];
  warnings: string[];
};

export const ahpService = {
  async calculateAll(userId: string): Promise<AHPResult> {
    const warnings: string[] = [];

    // ---- Step 1: Criteria Priorities ----
    const rootCriteria = await criteriaRepository.findRoots();
    if (rootCriteria.length < 2) {
      return {
        success: false,
        criteriaResult: null,
        supplierResults: [],
        ranking: [],
        warnings: ["Minimal 2 kriteria utama diperlukan"],
      };
    }

    const criteriaComparisons =
      await comparisonRepository.findCriteriaByUser(userId);
    if (criteriaComparisons.length === 0) {
      return {
        success: false,
        criteriaResult: null,
        supplierResults: [],
        ranking: [],
        warnings: [
          "Belum ada perbandingan kriteria. Silakan isi perbandingan berpasangan kriteria terlebih dahulu.",
        ],
      };
    }

    const criteriaEntities = rootCriteria.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    const criteriaComparisonsInput: ComparisonInput[] = criteriaComparisons.map(
      (c) => ({
        entity1Id: c.criteria1Id,
        entity2Id: c.criteria2Id,
        value: c.value,
      }),
    );

    let criteriaResult: AHPResult["criteriaResult"];
    try {
      const criteriaPriority = calculatePriorities(
        criteriaEntities,
        criteriaComparisonsInput,
      );

      await priorityRepository.deleteCriteriaByUser(userId);
      for (const item of criteriaPriority.items) {
        await priorityRepository.upsertCriteria(
          userId,
          item.id,
          item.priority,
          criteriaPriority.consistency.cr,
        );
      }

      criteriaResult = {
        items: criteriaPriority.items,
        consistency: criteriaPriority.consistency,
      };

      if (!criteriaPriority.consistency.isConsistent) {
        warnings.push(
          `Rasio Konsistensi (CR) kriteria = ${criteriaPriority.consistency.cr.toFixed(4)} (> 0.1). Perbandingan kriteria tidak konsisten. Sebaiknya revisi nilai perbandingan.`,
        );
      }
    } catch (error) {
      return {
        success: false,
        criteriaResult: null,
        supplierResults: [],
        ranking: [],
        warnings: [
          error instanceof Error
            ? error.message
            : "Gagal menghitung prioritas kriteria",
        ],
      };
    }

    // ---- Step 2: Supplier Priorities per Criteria ----
    const suppliers = await supplierRepository.findMany();
    if (suppliers.length < 2) {
      return {
        success: false,
        criteriaResult,
        supplierResults: [],
        ranking: [],
        warnings: [
          ...warnings,
          "Minimal 2 pemasok diperlukan untuk perbandingan",
        ],
      };
    }

    const supplierResults: AHPResult["supplierResults"] = [];
    const supplierEntities = suppliers.map((s) => ({
      id: s.id,
      name: s.name,
    }));

    for (const criteria of rootCriteria) {
      const supplierComparisons =
        await comparisonRepository.findSupplierByUserAndCriteria(
          userId,
          criteria.id,
        );

      if (supplierComparisons.length === 0) {
        warnings.push(
          `Belum ada perbandingan pemasok untuk kriteria "${criteria.name}".`,
        );
        continue;
      }

      const supplierComparisonsInput: ComparisonInput[] =
        supplierComparisons.map((c) => ({
          entity1Id: c.supplier1Id,
          entity2Id: c.supplier2Id,
          value: c.value,
        }));

      try {
        const supplierPriority = calculatePriorities(
          supplierEntities,
          supplierComparisonsInput,
        );

        await priorityRepository.deleteSupplierByUserAndCriteria(
          userId,
          criteria.id,
        );
        for (const item of supplierPriority.items) {
          await priorityRepository.upsertSupplier(
            userId,
            criteria.id,
            item.id,
            item.priority,
            supplierPriority.consistency.cr,
          );
        }

        supplierResults.push({
          criteriaId: criteria.id,
          criteriaName: criteria.name,
          items: supplierPriority.items,
          consistency: supplierPriority.consistency,
        });

        if (!supplierPriority.consistency.isConsistent) {
          warnings.push(
            `Rasio Konsistensi (CR) pemasok untuk kriteria "${criteria.name}" = ${supplierPriority.consistency.cr.toFixed(4)} (> 0.1). Sebaiknya revisi nilai perbandingan.`,
          );
        }
      } catch (error) {
        warnings.push(
          `Gagal menghitung prioritas pemasok untuk "${criteria.name}": ${error instanceof Error ? error.message : "Error"}`,
        );
      }
    }

    if (supplierResults.length === 0) {
      return {
        success: true,
        criteriaResult,
        supplierResults: [],
        ranking: [],
        warnings: [
          ...warnings,
          "Tidak ada data perbandingan pemasok yang cukup untuk menghitung peringkat.",
        ],
      };
    }

    // ---- Step 3: Final Ranking ----
    const criteriaWeights = criteriaResult.items.map((item) => ({
      criteriaId: item.id,
      criteriaName: item.name,
      priority: item.priority,
    }));

    const allSupplierPriorities: {
      criteriaId: string;
      criteriaName: string;
      supplierId: string;
      supplierName: string;
      priority: number;
    }[] = [];

    for (const sr of supplierResults) {
      for (const item of sr.items) {
        allSupplierPriorities.push({
          criteriaId: sr.criteriaId,
          criteriaName: sr.criteriaName,
          supplierId: item.id,
          supplierName: item.name,
          priority: item.priority,
        });
      }
    }

    const ranking = calculateFinalScores(
      criteriaWeights,
      allSupplierPriorities,
    );

    const result: AHPResult = {
      success: true,
      criteriaResult,
      supplierResults,
      ranking,
      warnings,
    };

    await historyRepository.create(userId, result as Record<string, unknown>);

    return result;
  },

  async getLastResults(userId: string): Promise<AHPResult> {
    const criteriaPriorities = await priorityRepository.findByUser(userId);

    if (criteriaPriorities.length === 0) {
      return {
        success: false,
        criteriaResult: null,
        supplierResults: [],
        ranking: [],
        warnings: [
          "Belum ada perhitungan AHP. Klik 'Hitung AHP' untuk memulai.",
        ],
      };
    }

    const consistencyRatio = criteriaPriorities[0].consistencyRatio ?? null;
    const allCrValues = criteriaPriorities
      .map((cp) => cp.consistencyRatio)
      .filter((cr): cr is number => cr !== null);

    const avgCr =
      allCrValues.length > 0
        ? allCrValues.reduce((a, b) => a + b, 0) / allCrValues.length
        : 0;

    const criteriaResult: AHPResult["criteriaResult"] = {
      items: criteriaPriorities.map((cp) => ({
        id: cp.criteriaId,
        name: cp.criteria.name,
        priority: cp.priority,
      })),
      consistency: {
        lambdaMax: 0,
        ci: 0,
        ri: 0,
        cr: consistencyRatio ?? avgCr,
        isConsistent: (consistencyRatio ?? avgCr) < 0.1,
      },
    };

    const supplierData = await priorityRepository.findSupplierByUser(userId);

    const groupedSuppliers = new Map<
      string,
      {
        criteriaName: string;
        items: { id: string; name: string; priority: number }[];
        crValues: number[];
      }
    >();
    for (const sp of supplierData) {
      if (!groupedSuppliers.has(sp.criteriaId)) {
        groupedSuppliers.set(sp.criteriaId, {
          criteriaName: sp.criteria.name,
          items: [],
          crValues: [],
        });
      }
      const group = groupedSuppliers.get(sp.criteriaId)!;
      if (!group.items.find((i) => i.id === sp.supplierId)) {
        group.items.push({
          id: sp.supplierId,
          name: sp.supplier.name,
          priority: sp.priority,
        });
      }
      if (sp.consistencyRatio !== null && sp.consistencyRatio !== undefined) {
        group.crValues.push(sp.consistencyRatio);
      }
    }

    const supplierResults: AHPResult["supplierResults"] = [];
    for (const [criteriaId, group] of groupedSuppliers) {
      group.items.sort((a, b) => b.priority - a.priority);
      const avgCr =
        group.crValues.length > 0
          ? group.crValues.reduce((a, b) => a + b, 0) / group.crValues.length
          : 0;
      supplierResults.push({
        criteriaId,
        criteriaName: group.criteriaName,
        items: group.items,
        consistency: {
          lambdaMax: 0,
          ci: 0,
          ri: 0,
          cr: avgCr,
          isConsistent: avgCr < 0.1,
        },
      });
    }

    const criteriaWeights = criteriaResult.items.map((item) => ({
      criteriaId: item.id,
      criteriaName: item.name,
      priority: item.priority,
    }));

    const allSupplierPriorities: {
      criteriaId: string;
      criteriaName: string;
      supplierId: string;
      supplierName: string;
      priority: number;
    }[] = [];

    for (const sr of supplierResults) {
      for (const item of sr.items) {
        allSupplierPriorities.push({
          criteriaId: sr.criteriaId,
          criteriaName: sr.criteriaName,
          supplierId: item.id,
          supplierName: item.name,
          priority: item.priority,
        });
      }
    }

    const ranking = calculateFinalScores(
      criteriaWeights,
      allSupplierPriorities,
    );

    const warnings: string[] = [];
    if (!criteriaResult.consistency.isConsistent) {
      warnings.push(
        `Rasio Konsistensi (CR) kriteria = ${criteriaResult.consistency.cr.toFixed(4)} (> 0.1). Perbandingan tidak konsisten.`,
      );
    }

    return {
      success: true,
      criteriaResult,
      supplierResults,
      ranking,
      warnings,
    };
  },
};
