import type { Metadata } from "next";
import AgreementPage from "@/views/AgreementPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    slug: string;
  };
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page({ params }: PageProps) {
  return <AgreementPage slug={params.slug} />;
}
