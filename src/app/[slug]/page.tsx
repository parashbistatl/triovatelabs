import { notFound, redirect } from "next/navigation";
import { getAgreementRecordBySlug } from "@/lib/server/content-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function Page({ params }: PageProps) {
  const agreement = await getAgreementRecordBySlug(params.slug).catch(() => null);

  if (!agreement) {
    notFound();
  }

  redirect(`/agreements/view/${params.slug}`);
}
