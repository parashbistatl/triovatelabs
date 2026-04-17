import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteFooter from "@/components/ui/site-footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getBlogBySlug } from "@/lib/content";
import type { BlogPost as BlogPostType } from "@/components/content-types";

function renderRichText(body: string) {
  return body
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={index} className="mt-10 text-2xl font-bold text-gray-900">
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }

      const imageMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        return (
          <img
            key={index}
            src={src}
            alt={alt}
            className="mt-6 w-full rounded-xl border border-gray-200"
          />
        );
      }

      return (
        <p key={index} className="mt-5 leading-8 text-gray-700">
          {block}
        </p>
      );
    });
}

const BlogPost = () => {
  const { slug } = useParams();
  const fallbackPost = useMemo(() => getBlogBySlug(slug || ""), [slug]);
  const [post, setPost] = useState<BlogPostType | undefined>(fallbackPost);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/content/blogs");
        if (!response.ok) return;
        const data = (await response.json()) as BlogPostType[];
        if (!Array.isArray(data)) return;
        const match = data.find((item) => item.slug === (slug || ""));
        if (match) {
          setPost(match);
        }
      } catch {
        // Keep fallback post.
      }
    };

    void load();
  }, [slug]);

  usePageSeo({
    title: post ? `${post.title} | Triovate Labs` : "Blog Post | Triovate Labs",
    description: post?.excerpt || "Read our latest blog post.",
    path: `/blogs/${slug || ""}`,
    ogImagePath: post?.coverImage || "/triovate1.png",
  });

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <main className="py-12">
          <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Post not found</h1>
            <p className="mt-3 text-gray-600">
              The requested blog post could not be found.
            </p>
            <Link to="/blogs" className="mt-6 inline-flex text-blue-700 hover:text-blue-800">
              Back to all blogs
            </Link>
          </section>
        </main>
        <div className="mt-auto">
          <SiteFooter />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="py-12">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link to="/blogs" className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
            Back to Blogs
          </Link>

          <p className="mt-4 text-sm font-medium text-blue-700">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-3 text-sm text-gray-500">By {post.author}</p>

          <img
            src={post.coverImage}
            alt={post.title}
            className="mt-8 h-auto w-full rounded-2xl border border-gray-200 object-cover"
          />

          <div className="mt-8 max-w-none">{renderRichText(post.body)}</div>

          <div className="mt-10">
            <Link to="/blogs" className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100">
              Back to All Blogs
            </Link>
          </div>
        </article>
      </main>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
};

export default BlogPost;
