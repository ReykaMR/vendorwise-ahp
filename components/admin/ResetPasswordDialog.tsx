"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock } from "lucide-react";
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from "@/lib/validations/admin.validation";
import { resetUserPassword } from "@/app/actions/admin.actions";

type ResetPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { id: string; name: string } | null;
};

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
}: ResetPasswordDialogProps) {
  const [state, formAction, isPending] = useActionState(
    resetUserPassword.bind(null, user?.id || ""),
    null,
  );

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "" },
  });

  useEffect(() => {
    if (state?.success) {
      reset();
      onOpenChange(false);
    }
  }, [state?.success, reset, onOpenChange]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Atur ulang password untuk <strong>{user.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="newPassword" className="text-teal-800">
              Password Baru
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="pl-9 border-teal-200 focus-visible:ring-teal-500"
                {...register("newPassword")}
              />
            </div>
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          {state?.errors?._form && (
            <Alert variant="destructive">
              <AlertDescription>{state.errors._form[0]}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
