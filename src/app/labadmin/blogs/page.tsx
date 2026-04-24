import { getAdminBlogs } from "@/lib/server/content-api";
import BlogsPage from "@/views/LabAdminBlogs";

export const dynamic = "force-dynamic";

export default async function Page() {
  const initialBlogs = await getAdminBlogs().catch(() => []);
  return <BlogsPage initialBlogs={initialBlogs} />;
}
