import { desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { blogs } from "@/lib/schema"
import BlogsClient from "@/components/admin/BlogsClient"

export default async function BlogsPage() {
  const blogRows = await db.select().from(blogs).orderBy(desc(blogs.createdAt))

  const serializedBlogs = blogRows.map((blog) => ({
    ...blog,
    publishedAt: blog.publishedAt ? blog.publishedAt.toISOString() : null,
  }))

  return <BlogsClient blogs={serializedBlogs} />
}
