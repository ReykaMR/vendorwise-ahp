"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  criteriaCreateSchema,
  criteriaUpdateSchema,
} from "@/lib/validations/criteria.validation";
import { createCriteria, updateCriteria } from "@/app/actions/criteria.actions";
import { checkCriteriaName } from "@/app/actions/check-duplicate.actions";
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
import { Loader2, ListTree, FileText } from "lucide-react";
import { Prisma } from "@/app/generated/prisma/client";

type CriteriaOption = Pick<Prisma.CriteriaModel, "id" | "name" | "level">;

type FormValues = {
  name: string;
  description?: string;
  parentId?: string;
};

type CriteriaFormProps = {
  mode: "create" | "edit";
  criteriaId?: string;
  defaultValues?: Partial<FormValues>;
  parents: CriteriaOption[];
  onSuccess?: () => void;
};

export function CriteriaForm({
  mode,
  criteriaId,
  defaultValues,
  parents,
  onSuccess,
}: CriteriaFormProps) {
  const router = useRouter();
  const action =
    mode === "create" ? createCriteria : updateCriteria.bind(null, criteriaId!);
  const [state, formAction, isPending] = useActionState(action, null);

  const schema =
    mode === "create" ? criteriaCreateSchema : criteriaUpdateSchema;

  const getDefaultValues = (): FormValues => ({
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
    parentId: defaultValues?.parentId || "none",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: getDefaultValues(),
  });

  useUnsavedChanges(form.formState.isDirty);

  const handleNameBlur = async () => {
    const name = form.getValues("name");
    if (!name || name.length < 2) return;

    const parentId = form.getValues("parentId");
    const result = await checkCriteriaName(
      name,
      parentId && parentId !== "none" ? parentId : undefined,
      criteriaId,
    );
    if (result.duplicate) {
      form.setError("name", { message: result.message });
    }
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(
        mode === "create"
          ? "Kriteria berhasil ditambahkan"
          : "Kriteria berhasil diubah",
      );
      if (onSuccess) onSuccess();
      else router.push("/criteria");
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
      <div>
        <Label htmlFor="name" className="text-teal-800">
          Nama Kriteria
        </Label>
        <div className="relative mt-1">
          <ListTree className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="name"
            placeholder="Contoh: Kualitas"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("name", { onBlur: handleNameBlur })}
          />
        </div>
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-teal-800">
          Deskripsi
        </Label>
        <div className="relative mt-1">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500" />
          <Input
            id="description"
            placeholder="Deskripsi kriteria (opsional)"
            className="pl-9 border-teal-200 focus-visible:ring-teal-500"
            {...form.register("description")}
          />
        </div>
        {form.formState.errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="parentId" className="text-teal-800">
          Induk Kriteria
        </Label>
        <Select
          name="parentId"
          defaultValue={form.getValues("parentId") || "none"}
          onValueChange={(value) =>
            form.setValue("parentId", value === "none" ? "" : value)
          }
        >
          <SelectTrigger className="mt-1 border-teal-200 focus:ring-teal-500">
            <SelectValue placeholder="Pilih induk (opsional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tidak ada (Kriteria Utama)</SelectItem>
            {parents.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {"\u00A0".repeat(p.level * 2)}
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.parentId && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.parentId.message}
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
