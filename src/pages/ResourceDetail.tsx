import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteFooter from "@/components/ui/site-footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { getResourceBySlug } from "@/lib/content";
import { resolveFileRefToUrl } from "@/lib/browser-file-store";
import type { ResourceItem } from "@/components/content-types";

const ResourceDetail = () => {
  const { slug } = useParams();
  const fallbackResource = useMemo(() => getResourceBySlug(slug || ""), [slug]);
  const [resource, setResource] = useState<ResourceItem | undefined>(fallbackResource);
  const [thumbnailSrc, setThumbnailSrc] = useState("");
  const [pdfHref, setPdfHref] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/content/resources");
        if (!response.ok) return;
        const data = (await response.json()) as ResourceItem[];
        if (!Array.isArray(data)) return;
        const match = data.find((item) => item.slug === (slug || ""));
        if (match) {
          setResource(match);
        }
      } catch {
        // Keep fallback resource.
      }
    };

    void load();
  }, [slug]);

  useEffect(() => {
    if (!resource) return;

    let active = true;
    let generatedThumb = "";
    let generatedPdf = "";

    const load = async () => {
      const [thumb, pdf] = await Promise.all([
        resolveFileRefToUrl(resource.thumbnail),
        resolveFileRefToUrl(resource.pdfUrl),
      ]);

      if (!active) return;

      setThumbnailSrc(thumb || "https://placehold.co/1200x600?text=No+Image");
      setPdfHref(pdf || "#");

      if (thumb.startsWith("blob:")) generatedThumb = thumb;
      if (pdf.startsWith("blob:")) generatedPdf = pdf;
    };

    void load();

    return () => {
      active = false;
      if (generatedThumb) URL.revokeObjectURL(generatedThumb);
      if (generatedPdf) URL.revokeObjectURL(generatedPdf);
    };
  }, [resource]);

  usePageSeo({
    title: resource ? `${resource.title} | Triovate Labs` : "Resource | Triovate Labs",
    description: resource?.description || "Explore this resource and download the PDF.",
    path: `/resources/${slug || ""}`,
    ogImagePath: resource?.thumbnail || "/triovate1.png",
  });

  if (!resource) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <main className="py-12">
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Resource not found</h1>
            <p className="mt-3 text-gray-600">
              The requested resource could not be found.
            </p>
            <Link to="/resources" className="mt-6 inline-flex text-blue-700 hover:text-blue-800">
              Back to all resources
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
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link to="/resources" className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
            Back to Resources
          </Link>

          <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Resource
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            {resource.title}
          </h1>
          <p className="mt-4 text-gray-600">{resource.description}</p>

          <img
            src={thumbnailSrc || resource.thumbnail}
            alt={resource.title}
            className="mt-8 w-full rounded-2xl border border-gray-200"
          />

          <div className="mt-8">
            <a
              href={pdfHref || resource.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Download PDF
            </a>
          </div>

          <div className="mt-6">
            <Link to="/resources" className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100">
              Back to All Resources
            </Link>
          </div>
        </section>
      </main>

      <div className="mt-auto">
        <SiteFooter />
      </div>
    </div>
  );
};

export default ResourceDetail;
