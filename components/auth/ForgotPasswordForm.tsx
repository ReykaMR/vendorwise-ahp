"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { requestPasswordReset } from "@/app/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

type ForgotInput = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotInput) => {
    setIsPending(true);
    setError(null);
    setSuccess(false);
    setResetLink(null);

    const result = await requestPasswordReset(data.email);
    setIsPending(false);

    if (result.success) {
      setSuccess(true);
      if (result.resetLink) {
        setResetLink(result.resetLink);
      }
    } else {
      setError(result.error || "Terjadi kesalahan");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-teal-100/50 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-teal-800">
          Lupa Password
        </CardTitle>
        <CardDescription className="text-center">
          Masukkan email Anda untuk mendapatkan link reset password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Instruksi reset password telah dikirim ke email Anda.
              </AlertDescription>
            </Alert>
            {resetLink && (
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
                <p className="font-medium mb-1">Link Reset (internal):</p>
                <a
                  href={resetLink}
                  className="underline break-all text-blue-600 hover:text-blue-800"
                >
                  {resetLink}
                </a>
              </div>
            )}
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-teal-600 hover:text-teal-800 underline"
              >
                Kembali ke halaman masuk
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-teal-800 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-9 border-teal-200 focus-visible:ring-teal-500"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Kirim Instruksi Reset"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-teal-600 hover:text-teal-800 underline"
              >
                Kembali ke halaman masuk
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
