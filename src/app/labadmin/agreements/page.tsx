import { getAdminAgreements } from "@/lib/server/content-api";
import AgreementsPage from "@/views/LabAdminAgreements";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialAgreements = await getAdminAgreements().catch(() => []);
  return <AgreementsPage initialAgreements={initialAgreements} />;
}
