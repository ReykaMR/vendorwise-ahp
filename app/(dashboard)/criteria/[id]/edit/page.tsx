import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { criteriaService } from "@/services/criteria.service";
import { CriteriaForm } from "@/components/criteria/CriteriaForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditCriteriaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCriteriaPage({
  params,
}: EditCriteriaPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/criteria");

  const { id } = await params;
  const criteria = await criteriaService.getById(id);
  if (!criteria) notFound();

  const parents = await criteriaService.getAvailableParents(criteria.id);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-teal-800">Edit Kriteria</CardTitle>
        </CardHeader>
        <CardContent>
          <CriteriaForm
            mode="edit"
            criteriaId={criteria.id}
            parents={parents}
            defaultValues={{
              name: criteria.name,
              description: criteria.description || "",
              parentId: criteria.parentId || "none",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
