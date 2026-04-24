import blogsData from "@/data/blogs.json";
import resourcesData from "@/data/resources.json";
import type { BlogPost, ResourceItem } from "@/components/content-types";

const blogs = blogsData as BlogPost[];
const resources = resourcesData as ResourceItem[];

function normalizeStatus(value: unknown): "draft" | "published" {
  return String(value || "").trim().toLowerCase() === "draft" ? "draft" : "published";
}

function normalizeBlog(item: BlogPost): BlogPost {
  return {
    ...item,
    status: normalizeStatus(item.status),
  };
}

function normalizeResource(item: ResourceItem): ResourceItem {
  return {
    ...item,
    status: normalizeStatus(item.status),
  };
}

export function getAllBlogs(): BlogPost[] {
  const staticBlogs = blogs.map(normalizeBlog);

  return staticBlogs
    .filter((item) => item.status === "published")
    .sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return getAllBlogs().find((post) => post.slug === slug);
}

export function getAllResources(): ResourceItem[] {
  const staticResources = resources.map(normalizeResource);
  return staticResources.filter((item) => item.status === "published");
}

export function getResourceBySlug(slug: string): ResourceItem | undefined {
  return getAllResources().find((resource) => resource.slug === slug);
}
