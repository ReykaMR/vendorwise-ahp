import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">
          Pengaturan
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Informasi akun Anda saat ini
        </p>
      </div>
      <SettingsForm
        user={{
          name: session.user.name || "",
          email: session.user.email || "",
        }}
      />
    </div>
  );
}
