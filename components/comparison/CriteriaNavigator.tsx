"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CriteriaNavigatorItem = {
  id: string;
  name: string;
};

type CriteriaNavigatorProps = {
  criteria: CriteriaNavigatorItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CriteriaNavigator({
  criteria,
  selectedId,
  onSelect,
}: CriteriaNavigatorProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-teal-800 whitespace-nowrap">
        Pilih Kriteria:
      </label>
      <Select value={selectedId} onValueChange={onSelect}>
        <SelectTrigger className="w-72 border-teal-200 focus:ring-teal-500">
          <SelectValue placeholder="Pilih kriteria" />
        </SelectTrigger>
        <SelectContent>
          {criteria.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
