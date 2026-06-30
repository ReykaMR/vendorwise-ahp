import { z } from "zod";

const saatyScaleValues = [
  1 / 9, 1 / 8, 1 / 7, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 5, 6,
  7, 8, 9,
] as const;

export const comparisonValueSchema = z
  .number()
  .refine(
    (val) =>
      saatyScaleValues.some(
        (s) => Math.abs(s - val) < 1e-10,
      ),
    { message: "Nilai harus berupa skala Saaty (1/9 – 9)" },
  );

export const saveComparisonSchema = z.object({
  criteria1Id: z.string().min(1, "ID kriteria 1 wajib diisi"),
  criteria2Id: z.string().min(1, "ID kriteria 2 wajib diisi"),
  value: comparisonValueSchema,
});

export const saveAllComparisonsSchema = z.object({
  comparisons: z.array(
    z.object({
      criteria1Id: z.string().min(1),
      criteria2Id: z.string().min(1),
      value: comparisonValueSchema,
    }),
  ),
});

export type SaveComparisonInput = z.infer<typeof saveComparisonSchema>;
export type SaveAllComparisonsInput = z.infer<typeof saveAllComparisonsSchema>;
