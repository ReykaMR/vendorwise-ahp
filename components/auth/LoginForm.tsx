"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LoginInput, loginSchema } from "@/lib/validations/auth.validation";
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
import { Loader2, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError("Email atau password salah");
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch {
        setError("Terjadi kesalahan, silakan coba lagi");
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-teal-100/50 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
          <LogIn className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl text-center text-teal-800">
          Masuk ke Akun
        </CardTitle>
        <CardDescription className="text-center">
          Masuk untuk melanjutkan ke{" "}
          <span className="font-semibold text-teal-700">VendorWise AHP</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {registered && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Registrasi berhasil! Silakan masuk dengan akun Anda.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-50 border-red-200 mb-4"
          >
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email" className="text-teal-800">
                Email
              </FieldLabel>
              <FieldContent>
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
              </FieldContent>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="password" className="text-teal-800">
                Password
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 border-teal-200 focus-visible:ring-teal-500"
                    {...register("password")}
                  />
                </div>
              </FieldContent>
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors py-4"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memeriksa...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-teal-700">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-teal-600 hover:text-teal-800 underline decoration-teal-300 underline-offset-2"
          >
            Daftar Sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
