"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RegisterInput,
  registerSchema,
} from "@/lib/validations/auth.validation";
import { registerUser } from "@/app/actions/auth.actions";
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
import {
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    setError,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect setelah sukses
  useEffect(() => {
    if (state?.success) {
      router.push("/login?registered=true");
    }
  }, [state?.success, router]);

  // Sinkronkan error dari server action ke form
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages && messages.length > 0) {
          setError(field as keyof RegisterInput, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }
  }, [state, setError]);

  return (
    <Card className="w-full max-w-md mx-auto border-teal-100/50 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl text-center text-teal-800">
          Daftar Akun
        </CardTitle>
        <CardDescription className="text-center">
          Buat akun baru untuk mulai menggunakan{" "}
          <span className="font-semibold text-teal-700">VendorWise AHP</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <FieldGroup>
            {/* Nama Lengkap */}
            <Field>
              <FieldLabel htmlFor="name" className="text-teal-800">
                Nama Lengkap
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-9 border-teal-200 focus-visible:ring-teal-500"
                    {...register("name")}
                  />
                </div>
              </FieldContent>
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* Email */}
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

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password" className="text-teal-800">
                Password
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 border-teal-200 focus-visible:ring-teal-500"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FieldContent>
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            {/* Konfirmasi Password */}
            <Field>
              <FieldLabel htmlFor="confirmPassword" className="text-teal-800">
                Konfirmasi Password
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 border-teal-200 focus-visible:ring-teal-500"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-500 hover:text-teal-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FieldContent>
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-colors py-4"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-teal-700">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-800 underline decoration-teal-300 underline-offset-2"
          >
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
