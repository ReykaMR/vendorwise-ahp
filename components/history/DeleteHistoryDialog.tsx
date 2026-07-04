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
import { deleteHistory } from "@/app/actions/history.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyId: string | null;
};

export function DeleteHistoryDialog({
  open,
  onOpenChange,
  historyId,
}: DeleteHistoryDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!historyId) return;
    setIsPending(true);
    setError(null);
    const result = await deleteHistory(historyId);
    if (result.success) {
      toast.success("Riwayat berhasil dihapus");
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
            Riwayat perhitungan ini akan dihapus secara permanen.
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
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
