import { criteriaRepository } from "@/repositories/criteria.repository";
import { supplierRepository } from "@/repositories/supplier.repository";
import { comparisonRepository } from "@/repositories/comparison.repository";
import { priorityRepository } from "@/repositories/priority.repository";
import { calculatePriorities } from "@/lib/ahp/priority";
import { calculateFinalScores, type SupplierScore } from "@/lib/ahp/final-score";
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

    const criteriaComparisons = await comparisonRepository.findCriteriaByUser(
      userId,
    );
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

    const ranking = calculateFinalScores(criteriaWeights, allSupplierPriorities);

    return {
      success: true,
      criteriaResult,
      supplierResults,
      ranking,
      warnings,
    };
  },
};
