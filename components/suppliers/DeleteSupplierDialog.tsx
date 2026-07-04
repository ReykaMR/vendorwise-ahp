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
import { deleteSupplier } from "@/app/actions/supplier.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteSupplierDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: { id: string; name: string } | null;
};

export function DeleteSupplierDialog({
  open,
  onOpenChange,
  supplier,
}: DeleteSupplierDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!supplier) return;
    setIsPending(true);
    setError(null);
    const result = await deleteSupplier(supplier.id);
    if (result.success) {
      toast.success("Pemasok berhasil dihapus");
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
          <DialogTitle className="text-center">Hapus Pemasok</DialogTitle>
          <DialogDescription className="text-center">
            Anda akan menghapus pemasok <strong>{supplier?.name}</strong>.
            Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data
            perbandingan serta prioritas terkait.
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
