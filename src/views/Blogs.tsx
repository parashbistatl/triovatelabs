"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import SiteFooter from "@/components/ui/site-footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getAllBlogs } from "@/lib/content";
import type { BlogPost } from "@/components/content-types";

function mergeBlogs(localItems: BlogPost[], apiItems: BlogPost[]) {
  const bySlug = new Map<string, BlogPost>();

  const normalizeStatus = (value: unknown) =>
    String(value || "").trim().toLowerCase() === "draft" ? "draft" : "published";

  for (const item of localItems) {
    bySlug.set(item.slug, { ...item, status: normalizeStatus(item.status) });
  }

  for (const item of apiItems) {
    bySlug.set(item.slug, { ...item, status: normalizeStatus(item.status) });
  }

  return Array.from(bySlug.values())
    .filter((item) => item.status === "published")
    .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

type BlogsProps = {
  initialPosts?: BlogPost[];
};

const Blogs = ({ initialPosts }: BlogsProps) => {
  const [posts, setPosts] = useState(initialPosts ?? getAllBlogs());
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest");

  useEffect(() => {
    if (posts.length > 0) {
      setShowEmptyState(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowEmptyState(true);
    }, 60);

    return () => window.clearTimeout(timer);
  }, [posts.length]);

  usePageSeo({
    title: "Blogs | Triovate Labs",
    description: "Read practical insights on websites, digital marketing, and custom software systems.",
    path: "/blogs",
    ogImagePath: "/triovate1.png",
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    if (!normalizedSearch) return true;
    const haystack = [post.title, post.excerpt, post.author, post.slug].join(" ").toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }

    if (sortBy === "oldest") {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }

    if (sortBy === "az") {
      return a.title.localeCompare(b.title);
    }

    return b.title.localeCompare(a.title);
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="py-12">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Blog
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Latest Articles
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Insights on web development, digital growth, and custom software
              systems.
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:max-w-2xl sm:flex-row">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, author, slug, or keyword..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "az" | "za")}>
                  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-0 focus:ring-offset-0 sm:w-44">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200 bg-white text-gray-900">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="az">Title A-Z</SelectItem>
                    <SelectItem value="za">Title Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredPosts.length}</span> of <span className="font-semibold text-gray-900">{posts.length}</span>
              </p>
            </div>
          </div>

          {posts.length > 0 ? (
            filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900">No Matching Blogs Found</h2>
                <p className="mt-2 text-gray-600">Try a different keyword or clear your search to view all published blogs.</p>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="mt-5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Clear Search
                </button>
              </div>
            )
          ) : (
            <div
              className={`relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm transition-all duration-700 sm:p-10 ${
                showEmptyState ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-blue-100/80 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-indigo-100/70 blur-2xl" />
              <div
                className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 shadow-sm transition-all duration-700 ${
                  showEmptyState ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                style={{ transitionDelay: "120ms" }}
              >
                <FileText size={26} />
                <Sparkles size={14} className="absolute -right-1 -top-1 text-indigo-500" />
              </div>
              <h2
                className={`text-2xl font-semibold text-gray-900 transition-all duration-700 ${
                  showEmptyState ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: "180ms" }}
              >
                No Blogs Published Yet
              </h2>
              <p
                className={`mx-auto mt-3 max-w-xl text-gray-600 transition-all duration-700 ${
                  showEmptyState ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: "240ms" }}
              >
                Fresh insights are on the way. Please check back soon for articles on growth, websites, and software systems.
              </p>
              <div
                className={`mt-6 flex flex-wrap justify-center gap-3 transition-all duration-700 ${
                  showEmptyState ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: "320ms" }}
              >
                <Link href="/services" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                  Explore Services
                </Link>
                <Link href="/contact" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100">
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
};

export default Blogs;
