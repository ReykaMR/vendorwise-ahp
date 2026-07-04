"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteMultipleHistory } from "@/app/actions/history.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteMultipleHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyIds: string[];
};

export function DeleteMultipleHistoryDialog({
  open,
  onOpenChange,
  historyIds,
}: DeleteMultipleHistoryDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (historyIds.length === 0) return;
    setIsPending(true);
    setError(null);
    const result = await deleteMultipleHistory(historyIds);
    if (result.success) {
      toast.success(`${historyIds.length} riwayat berhasil dihapus`);
      onOpenChange(false);
      router.refresh();
    } else {
      setError(result.error || "Gagal menghapus");
    }
    setIsPending(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Hapus Riwayat</DialogTitle>
          <DialogDescription className="text-center">
            {historyIds.length} riwayat perhitungan akan dihapus secara
            permanen.
            <br />
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Hapus {historyIds.length} riwayat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
