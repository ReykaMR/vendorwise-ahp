import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppTopbar />
        <main className="min-h-[calc(100vh-8rem)] p-4 lg:p-6">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}
