import { multiplyMatrixVector } from "./matrix";

const RI: number[] = [
  0, // n=1
  0, // n=2
  0.58, // n=3
  0.9, // n=4
  1.12, // n=5
  1.24, // n=6
  1.32, // n=7
  1.41, // n=8
  1.45, // n=9
  1.49, // n=10
  1.51, // n=11
  1.48, // n=12
  1.56, // n=13
  1.57, // n=14
  1.59, // n=15
];

export function getRI(n: number): number {
  if (n <= 0) return 0;
  if (n > RI.length) return RI[RI.length - 1];
  return RI[n - 1];
}

export function calculateLambdaMax(
  matrix: number[][],
  eigenvector: number[],
): number {
  const n = matrix.length;
  if (n === 0) return 0;

  const weightedSum = multiplyMatrixVector(matrix, eigenvector);
  let lambdaSum = 0;

  for (let i = 0; i < n; i++) {
    if (eigenvector[i] !== 0) {
      lambdaSum += weightedSum[i] / eigenvector[i];
    }
  }

  return lambdaSum / n;
}

export function calculateCI(lambdaMax: number, n: number): number {
  if (n <= 1) return 0;
  return (lambdaMax - n) / (n - 1);
}

export function calculateCR(ci: number, n: number): number {
  const ri = getRI(n);
  if (ri === 0) return 0;
  return ci / ri;
}

export type ConsistencyResult = {
  lambdaMax: number;
  ci: number;
  cr: number;
  isConsistent: boolean;
  ri: number;
};

export function analyzeConsistency(
  matrix: number[][],
  eigenvector: number[],
): ConsistencyResult {
  const n = matrix.length;
  const lambdaMax = calculateLambdaMax(matrix, eigenvector);
  const ci = calculateCI(lambdaMax, n);
  const ri = getRI(n);
  const cr = calculateCR(ci, n);

  return {
    lambdaMax,
    ci,
    cr,
    isConsistent: cr < 0.1,
    ri,
  };
}
