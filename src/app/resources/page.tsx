import type { ResourceItem } from "@/components/content-types";
import { getAllResources } from "@/lib/content";
import { getPublishedResources } from "@/lib/server/content-api";
import ResourcesPage from "@/views/Resources";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mergeResources(staticItems: ResourceItem[], dbItems: ResourceItem[]) {
  const bySlug = new Map<string, ResourceItem>();

  for (const item of staticItems) {
    bySlug.set(item.slug, item);
  }

  for (const item of dbItems) {
    bySlug.set(item.slug, item);
  }

  return Array.from(bySlug.values()).sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export default async function Page() {
  const dbResources = await getPublishedResources().catch(() => []);
  const initialResources = mergeResources(getAllResources(), dbResources);

  return <ResourcesPage initialResources={initialResources} />;
}
