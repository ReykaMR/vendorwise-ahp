"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect, useState } from "react";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  userCreateSchema,
  userUpdateSchema,
} from "@/lib/validations/admin.validation";
import { createUser, updateUser } from "@/app/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "USER";
};

type UserFormProps = {
  mode: "create" | "edit";
  userId?: string;
  defaultValues?: Partial<FormValues>;
  onSuccess?: () => void;
};

export function UserForm({
  mode,
  userId,
  defaultValues,
  onSuccess,
}: UserFormProps) {
  const router = useRouter();
  const action =
    mode === "create" ? createUser : updateUser.bind(null, userId!);
  const [state, formAction, isPending] = useActionState(action, null);
  const [showPassword, setShowPassword] = useState(false);

  const schema = mode === "create" ? userCreateSchema : userUpdateSchema;

  const getDefaultValues = (): FormValues => ({
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    password:
      mode === "create"
        ? (defaultValues as Record<string, string>)?.password || ""
        : undefined,
    role: defaultValues?.role || "USER",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: getDefaultValues(),
  });

  useUnsavedChanges(form.formState.isDirty);

  // Type guard untuk cek apakah field password ada
  const isCreateMode = mode === "create";

  useEffect(() => {
    if (state?.success) {
      toast.success(
        mode === "create"
          ? "Pengguna berhasil ditambahkan"
          : "Pengguna berhasil diubah",
      );
      if (onSuccess) onSuccess();
      else router.push("/admin/users");
    }
  }, [state?.success, router, onSuccess, mode]);

  useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([field, messages]) => {
        if (field !== "_form" && messages && messages.length > 0) {
          form.setError(field as keyof FormValues, { message: messages[0] });
        }
      });
    }
  }, [state, form]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Nama */}
      <div>
        <Label htmlFor="name" className="text-teal-800">
          Nama Lengkap
        </Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="name"
            placeholder="John Doe"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("name")}
          />
        </div>
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-teal-800">
          Email
        </Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Password (hanya mode create) */}
      {isCreateMode && (
        <div>
          <Label htmlFor="password" className="text-teal-800">
            Password
          </Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-10 border-teal-200 focus-visible:ring-teal-500"
              {...form.register("password" as keyof FormValues)}
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
          {"password" in form.formState.errors &&
            form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
        </div>
      )}

      {/* Role */}
      <div>
        <Label htmlFor="role" className="text-teal-800">
          Peran
        </Label>
        <Select
          name="role"
          defaultValue={form.getValues("role") as string}
          onValueChange={(value) =>
            form.setValue("role", value as "ADMIN" | "USER")
          }
        >
          <SelectTrigger className="mt-1 border-teal-200 focus:ring-teal-500">
            <SelectValue placeholder="Pilih peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.role && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      {state?.errors?._form && (
        <Alert variant="destructive">
          <AlertDescription>{state.errors._form[0]}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isPending}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Tambah" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
