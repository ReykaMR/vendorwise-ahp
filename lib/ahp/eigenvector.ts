import {
  normalizeColumns,
  type EntityInfo,
  type ComparisonInput,
  buildPairwiseMatrix,
} from "./matrix";

export function calculateEigenvector(matrix: number[][]): number[] {
  const normalized = normalizeColumns(matrix);
  const n = normalized.length;
  const eigenvector: number[] = [];

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += normalized[i][j];
    }
    eigenvector.push(sum / n);
  }

  return eigenvector;
}

export function calculateEigenvectorFromComparisons(
  entities: EntityInfo[],
  comparisons: ComparisonInput[],
): {
  eigenvector: number[];
  matrix: number[][];
  labels: string[];
  entityIds: string[];
} {
  const { matrix, labels, entityIds } = buildPairwiseMatrix(
    entities,
    comparisons,
  );
  const eigenvector = calculateEigenvector(matrix);
  return { eigenvector, matrix, labels, entityIds };
}
