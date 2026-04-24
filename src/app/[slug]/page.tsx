import { getAgreementBySlug } from "@/lib/server/content-api";
import AgreementPage from "@/views/AgreementPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: PageProps) {
  if (!params.slug) {
    return <AgreementPage agreement={null} error="Invalid agreement slug" />;
  }

  const agreement = await getAgreementBySlug(params.slug).catch(() => null);

  if (!agreement) {
    return <AgreementPage agreement={null} error="Agreement not found" />;
  }

  return <AgreementPage agreement={agreement} />;
}
