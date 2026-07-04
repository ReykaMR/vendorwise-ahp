import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { UserForm } from "@/components/admin/UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewUserPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle className="text-teal-800">Tambah Pengguna Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
