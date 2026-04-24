import { getAdminResources } from "@/lib/server/content-api";
import ResourcesPage from "@/views/LabAdminResources";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialResources = await getAdminResources().catch(() => []);
  return <ResourcesPage initialResources={initialResources} />;
}
