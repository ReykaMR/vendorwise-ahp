import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewSupplierPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/suppliers");

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-teal-800">Tambah Pemasok Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <SupplierForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
