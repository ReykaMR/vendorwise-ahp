import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { getHistoryDetail } from "@/app/actions/history.actions";
import { HistoryDetailClient } from "./HistoryDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HistoryDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const record = await getHistoryDetail(id);
  if (!record) notFound();

  return (
    <HistoryDetailClient
      id={record.id}
      label={record.label ?? "Perhitungan"}
      createdAt={record.createdAt}
      data={record.data}
    />
  );
}
