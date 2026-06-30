import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { supplierService } from "@/services/supplier.service";
import { criteriaService } from "@/services/criteria.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, ListTree, Layers, BarChart3 } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [suppliers, criteriaList, criteriaTree] = await Promise.all([
    supplierService.list(),
    criteriaService.list(),
    criteriaService.getTree(),
  ]);

  const rootCount = criteriaTree.length;
  const subCount = criteriaList.length - rootCount;

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight text-teal-800">
        Selamat datang, {session.user.name}!
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-teal-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-800">
              Total Pemasok
            </CardTitle>
            <Package className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {suppliers.length}
            </p>
            <CardDescription>Pemasok terdaftar</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-teal-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-800">
              Total Kriteria
            </CardTitle>
            <ListTree className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {criteriaList.length}
            </p>
            <CardDescription>Kriteria AHP</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-teal-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-800">
              Kriteria Utama
            </CardTitle>
            <Layers className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{rootCount}</p>
            <CardDescription>
              {subCount > 0
                ? `${subCount} subkriteria`
                : "Belum ada subkriteria"}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-teal-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-teal-800">
              Status AHP
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-teal-600">
              {criteriaList.length >= 2
                ? "Siap dihitung"
                : "Tambah minimal 2 kriteria"}
            </p>
            <CardDescription>
              {criteriaList.length >= 2 && suppliers.length >= 2
                ? "Semua data tersedia"
                : "Data belum lengkap"}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
