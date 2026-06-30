"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  supplierCreateSchema,
  supplierUpdateSchema,
} from "@/lib/validations/supplier.validation";
import { createSupplier, updateSupplier } from "@/app/actions/supplier.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, MapPin, User, Phone, Mail } from "lucide-react";

type FormValues = {
  name: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
};

type SupplierFormProps = {
  mode: "create" | "edit";
  supplierId?: string;
  defaultValues?: Partial<FormValues>;
  onSuccess?: () => void;
};

export function SupplierForm({
  mode,
  supplierId,
  defaultValues,
  onSuccess,
}: SupplierFormProps) {
  const router = useRouter();
  const action =
    mode === "create" ? createSupplier : updateSupplier.bind(null, supplierId!);
  const [state, formAction, isPending] = useActionState(action, null);

  const schema =
    mode === "create" ? supplierCreateSchema : supplierUpdateSchema;

  const getDefaultValues = (): FormValues => ({
    name: defaultValues?.name || "",
    address: defaultValues?.address || "",
    contactPerson: defaultValues?.contactPerson || "",
    phone: defaultValues?.phone || "",
    email: defaultValues?.email || "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: getDefaultValues(),
  });

  useEffect(() => {
    if (state?.success) {
      if (onSuccess) onSuccess();
      else router.push("/suppliers");
    }
  }, [state?.success, router, onSuccess]);

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
      <div>
        <Label htmlFor="name" className="text-teal-800">
          Nama Pemasok
        </Label>
        <div className="relative mt-1">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="name"
            placeholder="PT. Contoh Abadi"
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

      <div>
        <Label htmlFor="address" className="text-teal-800">
          Alamat
        </Label>
        <div className="relative mt-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="address"
            placeholder="Jl. Contoh No. 123"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("address")}
          />
        </div>
        {form.formState.errors.address && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="contactPerson" className="text-teal-800">
          Kontak Person
        </Label>
        <div className="relative mt-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="contactPerson"
            placeholder="John Doe"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("contactPerson")}
          />
        </div>
        {form.formState.errors.contactPerson && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.contactPerson.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="phone" className="text-teal-800">
          Telepon
        </Label>
        <div className="relative mt-1">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="phone"
            type="tel"
            placeholder="0812-3456-7890"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("phone")}
          />
        </div>
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="text-teal-800">
          Email
        </Label>
        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="email"
            type="email"
            placeholder="contact@contoh.com"
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
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Tambah" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
