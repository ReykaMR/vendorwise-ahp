import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight text-teal-800">
        Selamat datang, {session.user.name}!
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Pemasok</CardTitle>
            <CardDescription>Jumlah pemasok terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Kriteria</CardTitle>
            <CardDescription>Jumlah kriteria AHP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Status AHP</CardTitle>
            <CardDescription>Konsistensi terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">CR: 0.034 (Konsisten)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
