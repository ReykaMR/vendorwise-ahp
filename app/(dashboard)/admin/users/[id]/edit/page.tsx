import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { userService } from "@/services/user.service";
import { UserForm } from "@/components/admin/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EditUserPageProps = {
  params: { id: string };
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const user = await userService.getById(params.id);

  if (!user) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-teal-800">Edit Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            mode="edit"
            userId={user.id}
            defaultValues={{
              name: user.name,
              email: user.email,
              role: user.role,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
