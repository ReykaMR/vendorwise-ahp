export type ComparisonInput = {
  entity1Id: string;
  entity2Id: string;
  value: number;
};

export type EntityInfo = {
  id: string;
  name: string;
};

export function buildPairwiseMatrix(
  entities: EntityInfo[],
  comparisons: ComparisonInput[],
): { matrix: number[][]; labels: string[]; entityIds: string[] } {
  const sorted = [...entities]
    .map((e) => ({ id: e.id, name: e.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const map = new Map<string, number>();
  for (const comp of comparisons) {
    const key = `${comp.entity1Id}:${comp.entity2Id}`;
    map.set(key, comp.value);
  }

  const n = sorted.length;
  const matrix: number[][] = [];
  const labels = sorted.map((e) => e.name);
  const entityIds = sorted.map((e) => e.id);

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        row.push(1);
      } else {
        const key =
          sorted[i].id < sorted[j].id
            ? `${sorted[i].id}:${sorted[j].id}`
            : `${sorted[j].id}:${sorted[i].id}`;
        const storedValue = map.get(key);
        if (storedValue === undefined) {
          throw new Error(
            `Perbandingan antara "${sorted[i].name}" dan "${sorted[j].name}" belum diisi`,
          );
        }
        row.push(
          sorted[i].id < sorted[j].id ? storedValue : 1 / storedValue,
        );
      }
    }
    matrix.push(row);
  }

  return { matrix, labels, entityIds };
}

export function normalizeColumns(matrix: number[][]): number[][] {
  const n = matrix.length;
  if (n === 0) return [];

  const colSums: number[] = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  const normalized: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(colSums[j] !== 0 ? matrix[i][j] / colSums[j] : 0);
    }
    normalized.push(row);
  }

  return normalized;
}

export function multiplyMatrixVector(
  matrix: number[][],
  vector: number[],
): number[] {
  const n = matrix.length;
  const result: number[] = new Array(n).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += matrix[i][j] * vector[j];
    }
  }

  return result;
}
