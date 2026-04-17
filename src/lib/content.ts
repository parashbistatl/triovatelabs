import blogsData from "@/data/blogs.json";
import resourcesData from "@/data/resources.json";
import type { BlogPost, ResourceItem } from "@/components/content-types";

const blogs = blogsData as BlogPost[];
const resources = resourcesData as ResourceItem[];

const ADMIN_BLOGS_KEY = "labadmin_blogs";
const ADMIN_RESOURCES_KEY = "labadmin_resources";

function readAdminItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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
  const adminBlogs = readAdminItems<BlogPost>(ADMIN_BLOGS_KEY).map(normalizeBlog);
  const staticBlogs = blogs.map(normalizeBlog);

  return [...adminBlogs, ...staticBlogs]
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
  const adminResources = readAdminItems<ResourceItem>(ADMIN_RESOURCES_KEY).map(normalizeResource);
  const staticResources = resources.map(normalizeResource);
  return [...adminResources, ...staticResources].filter((item) => item.status === "published");
}

export function getResourceBySlug(slug: string): ResourceItem | undefined {
  return getAllResources().find((resource) => resource.slug === slug);
}
