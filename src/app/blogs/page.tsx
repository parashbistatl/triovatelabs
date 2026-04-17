import Link from "next/link";
import blogsData from "@/data/blogs.json";
import type { BlogPost } from "@/components/content-types";

const blogs = blogsData as BlogPost[];

export default function BlogsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Blog</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Latest Articles</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <img src={post.coverImage} alt={post.title} className="h-48 w-full object-cover" />
            <div className="space-y-3 p-5">
              <p className="text-sm text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
              <p className="text-sm leading-6 text-gray-600">{post.excerpt}</p>
              <Link href={`/blogs/${post.slug}`} className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800">
                Read article
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
