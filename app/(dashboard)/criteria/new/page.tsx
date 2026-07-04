import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { criteriaService } from "@/services/criteria.service";
import { CriteriaForm } from "@/components/criteria/CriteriaForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewCriteriaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/criteria");

  const parents = await criteriaService.getAvailableParents();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-teal-800">Tambah Kriteria Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <CriteriaForm mode="create" parents={parents} />
        </CardContent>
      </Card>
    </div>
  );
}
