"use client";

import { useState } from "react";
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
} from "lucide-react";
import type { HistoryListItem } from "@/app/actions/history.actions";
import { deleteHistory } from "@/app/actions/history.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type HistoryClientProps = {
  items: HistoryListItem[];
};

export function HistoryClient({ items }: HistoryClientProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16">
        <History className="h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-500">
          Belum ada riwayat perhitungan
        </h3>
        <p className="mt-1 text-sm text-gray-400">
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

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus riwayat ini?")) return;
    setDeleting(id);
    try {
      await deleteHistory(id);
      router.refresh();
    } catch {
      alert("Gagal menghapus");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const cr = item.criteriaCr;
        const isConsistent = cr !== null && cr < 0.1;

        return (
          <Link
            key={item.id}
            href={`/history/${item.id}`}
            className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-teal-200 hover:bg-teal-50/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">
                {item.label}
              </p>
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

            <div className="flex items-center gap-4 text-xs text-gray-500">
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

            <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-teal-600" />

            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(item.id);
              }}
              disabled={deleting === item.id}
              className="rounded p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title="Hapus"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Link>
        );
      })}
    </div>
  );
}
