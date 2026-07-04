"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import {
  UpdateProfileInput,
  updateProfileSchema,
} from "@/lib/validations/profile.validation";
import { updateProfile } from "@/app/actions/profile.actions";
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
import { Loader2, User, Mail } from "lucide-react";
import { toast } from "sonner";

type ProfileFormProps = {
  defaultValues: {
    name: string;
    email: string;
  };
};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  const {
    register,
    setError,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  useUnsavedChanges(isDirty);

  // Sinkronkan error dari server action ke form
  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages && messages.length > 0) {
          setError(field as keyof UpdateProfileInput, {
            type: "server",
            message: messages[0],
          });
        }
      });
    }
  }, [state, setError]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Profil berhasil diperbarui");
      reset(defaultValues);
    }
  }, [state?.success, reset, defaultValues]);

  return (
    <Card className="border-teal-100/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800">
          Informasi Profil
        </CardTitle>
        <CardDescription>
          Perbarui nama dan alamat email akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <FieldGroup>
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
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
