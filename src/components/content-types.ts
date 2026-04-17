export type ContentStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  publishedAt: string;
  coverImage: string;
  status: ContentStatus;
}

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  pdfUrl: string;
  status: ContentStatus;
}
