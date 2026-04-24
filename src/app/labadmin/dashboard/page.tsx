import { getAdminStats } from "@/lib/server/content-api";
import DashboardPage from "@/views/LabAdminDashboard";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialStats = await getAdminStats().catch(() => ({
    blogCount: 0,
    resourceCount: 0,
    agreementCount: 0,
  }));

  return <DashboardPage initialStats={initialStats} />;
}
