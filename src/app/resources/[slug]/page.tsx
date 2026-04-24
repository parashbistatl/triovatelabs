import { getResourceBySlug } from "@/lib/content";
import { getPublishedResourceBySlug } from "@/lib/server/content-api";
import ResourceDetailPage from "@/views/ResourceDetail";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  const initialResource =
    (await getPublishedResourceBySlug(params.slug).catch(() => null)) || getResourceBySlug(params.slug);

  return <ResourceDetailPage slug={params.slug} initialResource={initialResource ?? undefined} />;
}
