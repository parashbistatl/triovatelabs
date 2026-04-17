import { Link } from "react-router-dom";
import type { BlogPost } from "@/components/content-types";

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={post.coverImage}
        alt={post.title}
        className="h-48 w-full object-cover"
        loading="lazy"
      />

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

        <Link
          to={`/blogs/${post.slug}`}
          className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
