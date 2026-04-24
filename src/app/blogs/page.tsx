import type { BlogPost } from "@/components/content-types";
import { getAllBlogs } from "@/lib/content";
import { getPublishedBlogs } from "@/lib/server/content-api";
import BlogsPage from "@/views/Blogs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function mergeBlogs(staticItems: BlogPost[], dbItems: BlogPost[]) {
  const bySlug = new Map<string, BlogPost>();

  for (const item of staticItems) {
    bySlug.set(item.slug, item);
  }

  for (const item of dbItems) {
    bySlug.set(item.slug, item);
  }

  return Array.from(bySlug.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export default async function Page() {
  const dbPosts = await getPublishedBlogs().catch(() => []);
  const initialPosts = mergeBlogs(getAllBlogs(), dbPosts);

  return <BlogsPage initialPosts={initialPosts} />;
}
