import { getBlogBySlug } from "@/lib/content";
import { getPublishedBlogBySlug } from "@/lib/server/content-api";
import BlogPostPage from "@/views/BlogPost";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  const initialPost =
    (await getPublishedBlogBySlug(params.slug).catch(() => null)) || getBlogBySlug(params.slug);

  return <BlogPostPage slug={params.slug} initialPost={initialPost ?? undefined} />;
}
