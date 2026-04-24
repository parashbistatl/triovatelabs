"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, FolderOpen } from "lucide-react";
import ResourceCard from "@/components/ResourceCard";
import SiteFooter from "@/components/ui/site-footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getAllResources } from "@/lib/content";
import type { ResourceItem } from "@/components/content-types";

function mergeResources(localItems: ResourceItem[], apiItems: ResourceItem[]) {
  const bySlug = new Map<string, ResourceItem>();

  const normalizeStatus = (value: unknown) =>
    String(value || "").trim().toLowerCase() === "draft" ? "draft" : "published";

  for (const item of localItems) {
    bySlug.set(item.slug, { ...item, status: normalizeStatus(item.status) });
  }

  for (const item of apiItems) {
    bySlug.set(item.slug, { ...item, status: normalizeStatus(item.status) });
  }

  return Array.from(bySlug.values()).filter((item) => item.status === "published");
}

type ResourcesProps = {
  initialResources?: ResourceItem[];
};

const Resources = ({ initialResources }: ResourcesProps) => {
  const [resources, setResources] = useState(initialResources ?? getAllResources());
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest");

  useEffect(() => {
    if (resources.length > 0) {
      setShowEmptyState(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowEmptyState(true);
    }, 60);

    return () => window.clearTimeout(timer);
  }, [resources.length]);

  usePageSeo({
    title: "Resources | Triovate Labs",
    description: "Download practical templates and guides for websites, marketing, and growth systems.",
    path: "/resources",
    ogImagePath: "/triovate1.png",
  });

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredResources = resources.filter((resource) => {
    if (!normalizedSearch) return true;
    const haystack = [resource.title, resource.description, resource.slug].join(" ").toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === "newest") {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    }

    if (sortBy === "oldest") {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    }

    if (sortBy === "az") return a.title.localeCompare(b.title);
    return b.title.localeCompare(a.title);
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="py-12">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Resources
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Free Downloads
            </h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Actionable templates, checklists, and guides you can use right away.
            </p>
          </div>

          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, description, or keyword..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "az" | "za")}>
                  <SelectTrigger className="w-full rounded-lg border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-0 focus:ring-offset-0 sm:w-40">
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
                Showing <span className="font-semibold text-gray-900">{filteredResources.length}</span> of <span className="font-semibold text-gray-900">{resources.length}</span>
              </p>
            </div>
          </div>

          {resources.length > 0 ? (
            filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-900">No Matching Resources Found</h2>
                <p className="mt-2 text-gray-600">Try another keyword or clear your search to see all published resources.</p>
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
              <div className="pointer-events-none absolute -left-8 -top-12 h-36 w-36 rounded-full bg-cyan-100/80 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-14 -right-10 h-36 w-36 rounded-full bg-blue-100/70 blur-2xl" />
              <div
                className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 shadow-sm transition-all duration-700 ${
                  showEmptyState ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                style={{ transitionDelay: "120ms" }}
              >
                <FolderOpen size={26} />
                <Download size={14} className="absolute -right-1 -top-1 text-blue-600" />
              </div>
              <h2
                className={`text-2xl font-semibold text-gray-900 transition-all duration-700 ${
                  showEmptyState ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: "180ms" }}
              >
                No Resources Available Right Now
              </h2>
              <p
                className={`mx-auto mt-3 max-w-xl text-gray-600 transition-all duration-700 ${
                  showEmptyState ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: "240ms" }}
              >
                We are preparing high-value downloads for you. Please check back soon or reach out and we will share the latest materials directly.
              </p>
              <div
                className={`mt-6 flex flex-wrap justify-center gap-3 transition-all duration-700 ${
                  showEmptyState ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
                }`}
                style={{ transitionDelay: "320ms" }}
              >
                <Link href="/contact" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                  Request a Resource
                </Link>
                <Link href="/services" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100">
                  View Services
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

export default Resources;
