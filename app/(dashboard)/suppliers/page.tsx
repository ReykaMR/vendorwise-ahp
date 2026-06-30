import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { supplierService } from "@/services/supplier.service";
import { SuppliersDataTable } from "@/components/suppliers/SuppliersDataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function SuppliersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const suppliers = await supplierService.list();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-teal-800">Daftar Pemasok</h1>
        <Link href="/suppliers/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tambah Pemasok
          </Button>
        </Link>
      </div>
      <SuppliersDataTable suppliers={suppliers} />
    </div>
  );
}
