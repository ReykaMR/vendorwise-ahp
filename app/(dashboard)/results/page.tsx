import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { ahpService } from "@/services/ahp.service";
import { ResultsClient } from "./ResultsClient";

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const result = await ahpService.getLastResults(session.user.id);

  return (
    <ResultsClient
      initialResult={result.success ? result : null}
      initialError={result.warnings.length > 0 && !result.success ? result.warnings[0] : null}
    />
  );
}
