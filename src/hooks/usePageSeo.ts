import { useEffect } from "react";

interface PageSeoOptions {
  /** Page-specific title */
  title: string;
  /** Plain-text meta description */
  description: string;
  /** Path portion of the URL, e.g. "/", "/about" */
  path: string;
  /** Optional path to an Open Graph image in /public */
  ogImagePath?: string;
  /** Optional robots directive, e.g. "noindex, follow" */
  robots?: string;
}

const DEFAULT_SITE_URL =
  import.meta.env.VITE_SITE_URL?.replace(/\/$/, "") || "https://triovatelabs.com";

const DEFAULT_OG_IMAGE = "/triovate1.png";

export function usePageSeo({
  title,
  description,
  path,
  ogImagePath,
  robots,
}: PageSeoOptions) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const fullUrl = `${DEFAULT_SITE_URL}${path}`;
    const ogImageUrl = `${DEFAULT_SITE_URL}${
      ogImagePath || DEFAULT_OG_IMAGE
    }`;

    // Document title
    document.title = title;

    const ensureNamedMeta = (name: string, content: string) => {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const ensurePropertyMeta = (property: string, content: string) => {
      if (!content) return;
      let el = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    // Basic SEO
    ensureNamedMeta("description", description);

    // Robots directive (e.g. "noindex, follow")
    if (robots) {
      ensureNamedMeta("robots", robots);
    } else {
      // Remove robots meta if not set (allow indexing by default)
      const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (existingRobots) existingRobots.remove();
    }

    // Open Graph
    ensurePropertyMeta("og:title", title);
    ensurePropertyMeta("og:description", description);
    ensurePropertyMeta("og:type", "website");
    ensurePropertyMeta("og:url", fullUrl);
    ensurePropertyMeta("og:image", ogImageUrl);

    // Twitter
    ensureNamedMeta("twitter:card", "summary_large_image");
    ensureNamedMeta("twitter:title", title);
    ensureNamedMeta("twitter:description", description);
    ensureNamedMeta("twitter:image", ogImageUrl);

    // Canonical link
    let canonicalLink = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullUrl;
  }, [title, description, path, ogImagePath, robots]);
}

