import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Reset Password - VendorWise AHP",
  description: "Atur password baru akun VendorWise AHP.",
};

export default async function ResetPasswordPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  const { token } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <ResetPasswordForm token={token} />
    </div>
  );
}
