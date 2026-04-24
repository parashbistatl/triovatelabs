import Link from "next/link";
import type { BlogPost } from "@/components/content-types";

type BlogCardProps = {
  post: BlogPost;
};

function truncateWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={post.coverImage}
        alt={post.title}
        className="h-48 w-full object-cover"
        loading="lazy"
      />

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <p className="text-sm text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <h2
          className="min-h-[3.5rem] text-xl font-semibold leading-7 text-gray-900"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h2>
        <p className="min-h-[6rem] text-sm leading-6 text-gray-600">
          {truncateWords(post.excerpt, 26)}
        </p>

        <Link
          href={`/blogs/${post.slug}`}
          className="mt-auto inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
