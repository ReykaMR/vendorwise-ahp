export type CriteriaWeight = {
  criteriaId: string;
  criteriaName: string;
  priority: number;
};

export type SupplierScore = {
  supplierId: string;
  supplierName: string;
  scores: { criteriaId: string; criteriaName: string; score: number }[];
  totalScore: number;
};

export function calculateFinalScores(
  criteriaWeights: CriteriaWeight[],
  supplierPriorities: {
    criteriaId: string;
    criteriaName: string;
    supplierId: string;
    supplierName: string;
    priority: number;
  }[],
): SupplierScore[] {
  const supplierMap = new Map<string, SupplierScore>();

  for (const sp of supplierPriorities) {
    if (!supplierMap.has(sp.supplierId)) {
      supplierMap.set(sp.supplierId, {
        supplierId: sp.supplierId,
        supplierName: sp.supplierName,
        scores: [],
        totalScore: 0,
      });
    }
  }

  for (const cw of criteriaWeights) {
    for (const sp of supplierPriorities) {
      if (sp.criteriaId !== cw.criteriaId) continue;

      const entry = supplierMap.get(sp.supplierId);
      if (!entry) continue;

      const weightedScore = cw.priority * sp.priority;
      entry.scores.push({
        criteriaId: sp.criteriaId,
        criteriaName: sp.criteriaName,
        score: weightedScore,
      });
      entry.totalScore += weightedScore;
    }
  }

  const results = Array.from(supplierMap.values());
  results.sort((a, b) => b.totalScore - a.totalScore);

  return results;
}
