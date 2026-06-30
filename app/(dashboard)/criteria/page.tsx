import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { criteriaService } from "@/services/criteria.service";
import { CriteriaTree } from "@/components/criteria/CriteriaTree";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CriteriaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const tree = await criteriaService.getTree();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-teal-800">Daftar Kriteria</h1>
        <Link href="/criteria/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Plus className="mr-2 h-4 w-4" /> Tambah Kriteria
          </Button>
        </Link>
      </div>
      <CriteriaTree nodes={tree} />
    </div>
  );
}
