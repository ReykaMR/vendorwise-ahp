import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password - VendorWise AHP",
  description: "Reset password akun VendorWise AHP.",
};

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <ForgotPasswordForm />
    </div>
  );
}
