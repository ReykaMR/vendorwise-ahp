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
import { deleteCriteria } from "@/app/actions/criteria.actions";
import { useRouter } from "next/navigation";
import { Prisma } from "@/app/generated/prisma/client";

type CriteriaNode = Pick<Prisma.CriteriaModel, "id" | "name" | "level"> & {
  children: CriteriaNode[];
};

type DeleteCriteriaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criteria: CriteriaNode | null;
};

export function DeleteCriteriaDialog({
  open,
  onOpenChange,
  criteria,
}: DeleteCriteriaDialogProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const childCount = criteria?.children.length || 0;

  const handleDelete = async () => {
    if (!criteria) return;
    setIsPending(true);
    setError(null);
    const result = await deleteCriteria(criteria.id);
    if (result.success) {
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
          <DialogTitle className="text-center">Hapus Kriteria</DialogTitle>
          <DialogDescription className="text-center">
            Anda akan menghapus kriteria <strong>{criteria?.name}</strong>.
            {childCount > 0 && (
              <>
                <br />
                Kriteria ini memiliki <strong>
                  {childCount} subkriteria
                </strong>{" "}
                yang juga akan ikut terhapus.
              </>
            )}
            <br />
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
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
