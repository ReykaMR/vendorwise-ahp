import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-teal-800">Pengaturan Profil</h1>
      <ProfileForm defaultValues={{ name: user.name, email: user.email }} />
      <ChangePasswordForm />
    </div>
  );
}
