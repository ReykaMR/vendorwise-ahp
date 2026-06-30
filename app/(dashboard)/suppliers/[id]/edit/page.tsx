import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { supplierService } from "@/services/supplier.service";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditSupplierPageProps = {
  params: { id: string };
};

export default async function EditSupplierPage({
  params,
}: EditSupplierPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const supplier = await supplierService.getById(params.id);
  if (!supplier) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-teal-800">Edit Pemasok</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm
            mode="edit"
            supplierId={supplier.id}
            defaultValues={{
              name: supplier.name,
              address: supplier.address || "",
              contactPerson: supplier.contactPerson || "",
              phone: supplier.phone || "",
              email: supplier.email || "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
