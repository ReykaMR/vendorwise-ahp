"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  History,
  ChevronRight,
  Trash2,
  Clock,
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Search,
  Pencil,
  Check,
  X,
} from "lucide-react";
import type { HistoryListItem } from "@/app/actions/history.actions";
import { updateHistoryLabel } from "@/app/actions/history.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { DeleteHistoryDialog } from "@/components/history/DeleteHistoryDialog";
import { DeleteMultipleHistoryDialog } from "@/components/history/DeleteMultipleHistoryDialog";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";

const PAGE_SIZE = 15;

type HistoryClientProps = {
  items: HistoryListItem[];
};

export function HistoryClient({ items }: HistoryClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectAllOnPage =
    paginated.length > 0 && paginated.every((i) => selected.has(i.id));

  const handleSelectAll = useCallback(() => {
    if (selectAllOnPage) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const item of paginated) next.delete(item.id);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const item of paginated) next.add(item.id);
        return next;
      });
    }
  }, [paginated, selectAllOnPage]);

  const handleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const startEditing = useCallback((id: string, currentLabel: string) => {
    setEditingId(id);
    setEditValue(currentLabel);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  const saveEditing = useCallback(async () => {
    if (!editingId || !editValue.trim()) return;
    const formData = new FormData();
    formData.set("label", editValue.trim());
    const result = await updateHistoryLabel(editingId, formData);
    if (result.success) {
      toast.success("Label diperbarui");
      setEditingId(null);
      setEditValue("");
      router.refresh();
    } else {
      toast.error(result.error || "Gagal memperbarui label");
    }
  }, [editingId, editValue, router]);

  useEffect(() => {
    if (editingId) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingId]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 py-16">
        <History className="h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-500">
          Belum ada riwayat perhitungan
        </h3>
        <p className="mt-1 text-center text-sm text-gray-400">
          Lakukan perhitungan AHP di halaman Hasil untuk memulai.
        </p>
        <Link href="/results">
          <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
            Ke Halaman Hasil
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            placeholder="Cari riwayat..."
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <p className="text-sm text-gray-400">
          {filtered.length} dari {items.length} riwayat
        </p>

        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <span className="text-sm text-gray-500">
              {selected.size} terpilih
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            disabled={selected.size === 0}
            onClick={() => {
              if (selected.size > 0) setBulkDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus Terpilih
          </Button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-2 px-1">
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            checked={selectAllOnPage}
            onChange={handleSelectAll}
          />
          Pilih semua di halaman ini
        </label>
      </div>

      {paginated.map((item) => {
        const cr = item.criteriaCr;
        const isConsistent = cr !== null && cr < 0.1;
        const isSelected = selected.has(item.id);
        const isEditing = editingId === item.id;

        return (
          <div
            key={item.id}
            className={`group relative rounded-lg border transition-colors ${
              isSelected
                ? "border-teal-300 bg-teal-50/60"
                : "border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/50"
            }`}
          >
            <div className="flex items-start p-4 pr-14 sm:items-center">
              <label className="flex items-center self-stretch pr-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  checked={isSelected}
                  onChange={() => handleSelect(item.id)}
                />
              </label>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
                <Clock className="h-5 w-5 text-teal-600" />
              </div>

              <Link
                href={`/history/${item.id}`}
                className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        ref={editInputRef}
                        type="text"
                        className="block w-full rounded-md border border-teal-300 px-2 py-1 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEditing();
                          }
                          if (e.key === "Escape") {
                            cancelEditing();
                          }
                        }}
                      />
                      <button
                        onClick={saveEditing}
                        className="flex h-7 w-7 items-center justify-center rounded text-green-600 hover:bg-green-50"
                        title="Simpan"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-100"
                        title="Batal"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="truncate text-sm font-medium text-gray-800">
                      {item.label}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {item.createdAt.toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3.5 w-3.5" />
                    {item.supplierCount} kriteria
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {item.rankingCount} pemasok
                  </span>
                  <span className="flex items-center gap-1">
                    {isConsistent ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    {cr !== null ? `CR ${cr.toFixed(3)}` : "N/A"}
                  </span>
                </div>

                <ChevronRight className="hidden h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-teal-600 sm:block" />
              </Link>
            </div>

            {/* Edit label button */}
            {!isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(item.id, item.label);
                }}
                className="absolute right-10 top-3 flex h-7 w-7 items-center justify-center rounded text-gray-300 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 sm:right-12"
                title="Ubah label"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Single delete button */}
            <button
              onClick={() => setDeleteId(item.id)}
              className="absolute right-2 top-3 flex h-7 w-7 items-center justify-center rounded text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
              title="Hapus"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DeleteHistoryDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        historyId={deleteId}
      />

      <DeleteMultipleHistoryDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        historyIds={Array.from(selected)}
      />
    </div>
  );
}
