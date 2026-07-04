import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar - VendorWise AHP",
  description: "Halaman pendaftaran akun baru VendorWise AHP.",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  // Jika sudah login, redirect ke dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <RegisterForm />
    </div>
  );
}
