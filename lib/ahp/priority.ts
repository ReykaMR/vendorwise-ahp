import {
  calculateEigenvectorFromComparisons,
} from "./eigenvector";
import { analyzeConsistency } from "./consistency";
import type { EntityInfo, ComparisonInput } from "./matrix";

export type PriorityResult = {
  items: { id: string; name: string; priority: number }[];
  consistency: {
    lambdaMax: number;
    ci: number;
    ri: number;
    cr: number;
    isConsistent: boolean;
  };
  matrix: number[][];
};

export function calculatePriorities(
  entities: EntityInfo[],
  comparisons: ComparisonInput[],
): PriorityResult {
  const { eigenvector, matrix, entityIds } =
    calculateEigenvectorFromComparisons(entities, comparisons);

  const consistency = analyzeConsistency(matrix, eigenvector);

  const idToPriority = new Map<string, number>();
  for (let i = 0; i < entityIds.length; i++) {
    idToPriority.set(entityIds[i], eigenvector[i]);
  }

  const items = entities
    .map((e) => ({
      id: e.id,
      name: e.name,
      priority: idToPriority.get(e.id) ?? 0,
    }))
    .sort((a, b) => b.priority - a.priority);

  return {
    items,
    consistency: {
      lambdaMax: consistency.lambdaMax,
      ci: consistency.ci,
      ri: consistency.ri,
      cr: consistency.cr,
      isConsistent: consistency.isConsistent,
    },
    matrix,
  };
}
