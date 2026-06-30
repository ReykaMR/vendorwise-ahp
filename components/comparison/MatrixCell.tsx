"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SAATY_VALUES = [
  { value: 1 / 9, label: "1/9" },
  { value: 1 / 8, label: "1/8" },
  { value: 1 / 7, label: "1/7" },
  { value: 1 / 6, label: "1/6" },
  { value: 1 / 5, label: "1/5" },
  { value: 1 / 4, label: "1/4" },
  { value: 1 / 3, label: "1/3" },
  { value: 1 / 2, label: "1/2" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
];

const SAATY_DESCRIPTIONS: Record<string, string> = {
  "1/9": "Sangat ekstrem kurang penting",
  "1/8": "Sangat kuat ke ekstrem kurang penting",
  "1/7": "Sangat kuat kurang penting",
  "1/6": "Kuat ke sangat kuat kurang penting",
  "1/5": "Kuat kurang penting",
  "1/4": "Sedang ke kuat kurang penting",
  "1/3": "Sedang kurang penting",
  "1/2": "Sedikit ke sedang kurang penting",
  "1": "Sama penting",
  "2": "Sedikit lebih penting",
  "3": "Sedang lebih penting",
  "4": "Sedang ke kuat lebih penting",
  "5": "Kuat lebih penting",
  "6": "Kuat ke sangat kuat lebih penting",
  "7": "Sangat kuat lebih penting",
  "8": "Sangat kuat ke ekstrem lebih penting",
  "9": "Ekstrem lebih penting",
};

type MatrixCellProps = {
  value: number | null;
  isReadonly: boolean;
  onChange: (value: number) => void;
};

function formatValue(val: number | null): string {
  if (val === null) return "";
  if (Math.abs(val - Math.round(val)) < 1e-10) return String(Math.round(val));
  return `1/${Math.round(1 / val)}`;
}

export function MatrixCell({
  value,
  isReadonly,
  onChange,
}: MatrixCellProps) {
  if (isReadonly) {
    const display = value !== null ? formatValue(value) : "-";
    return (
      <div className="flex h-10 items-center justify-center rounded-md bg-gray-50 text-sm text-gray-500">
        {display}
      </div>
    );
  }

  const currentValue = SAATY_VALUES.find(
    (s) => Math.abs(s.value - (value ?? 0)) < 1e-10,
  );

  return (
    <Select
      value={currentValue ? formatValue(currentValue.value) : ""}
      onValueChange={(strVal) => {
        const found = SAATY_VALUES.find((s) => s.label === strVal);
        if (found) onChange(found.value);
      }}
    >
      <SelectTrigger className="h-10 w-full border-teal-200 bg-white text-sm focus:ring-teal-500">
        <SelectValue
          placeholder="—"
          className="text-gray-400"
        />
      </SelectTrigger>
      <SelectContent>
        {SAATY_VALUES.map((s) => (
          <SelectItem key={s.label} value={s.label}>
            <span className="font-medium">{s.label}</span>
            <span className="ml-2 text-xs text-gray-400">
              {SAATY_DESCRIPTIONS[s.label]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
