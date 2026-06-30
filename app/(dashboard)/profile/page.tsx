import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { userService } from "@/services/user.service";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil — VendorWise AHP",
  description: "Pengaturan profil pengguna VendorWise AHP.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await userService.getProfile(session.user.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-teal-800">
        Pengaturan Profil
      </h1>
      <ProfileForm defaultValues={{ name: user.name, email: user.email }} />
      <ChangePasswordForm />
    </div>
  );
}
