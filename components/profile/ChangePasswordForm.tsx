"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import {
  ChangePasswordInput,
  changePasswordSchema,
} from "@/lib/validations/profile.validation";
import { changePassword } from "@/app/actions/profile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    setError,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages && messages.length > 0) {
          setError(field as keyof ChangePasswordInput, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }
  }, [state, setError]);

  useEffect(() => {
    if (state?.success) {
      reset();
    }
  }, [state?.success, reset]);

  return (
    <Card className="border-teal-100/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">Ganti Password</CardTitle>
        <CardDescription>
          Pastikan password baru minimal 8 karakter.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password berhasil diubah.
              </AlertDescription>
            </Alert>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="currentPassword" className="text-teal-800">
                Password Saat Ini
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 border-teal-200 focus-visible:ring-teal-500"
                    {...register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700"
                    tabIndex={-1}
                  >
                    {showCurrent ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FieldContent>
              {errors.currentPassword && (
                <FieldError>{errors.currentPassword.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="newPassword" className="text-teal-800">
                Password Baru
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 border-teal-200 focus-visible:ring-teal-500"
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700"
                    tabIndex={-1}
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FieldContent>
              {errors.newPassword && (
                <FieldError>{errors.newPassword.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel
                htmlFor="confirmNewPassword"
                className="text-teal-800"
              >
                Konfirmasi Password Baru
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="confirmNewPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 border-teal-200 focus-visible:ring-teal-500"
                    {...register("confirmNewPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700"
                    tabIndex={-1}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FieldContent>
              {errors.confirmNewPassword && (
                <FieldError>{errors.confirmNewPassword.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          {state?.errors?._form && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {state.errors._form[0]}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengganti...
              </>
            ) : (
              "Ganti Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
