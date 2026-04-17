import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ResourceItem } from "@/components/content-types";
import { resolveFileRefToUrl } from "@/lib/browser-file-store";

type ResourceCardProps = {
  resource: ResourceItem;
};

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState(resource.thumbnail);
  const [pdfHref, setPdfHref] = useState(resource.pdfUrl);

  useEffect(() => {
    let active = true;
    let generatedThumb = "";
    let generatedPdf = "";

    const load = async () => {
      const [thumb, pdf] = await Promise.all([
        resolveFileRefToUrl(resource.thumbnail),
        resolveFileRefToUrl(resource.pdfUrl),
      ]);

      if (!active) return;

      setThumbnailSrc(thumb || "https://placehold.co/600x300?text=No+Image");
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
  }, [resource.thumbnail, resource.pdfUrl]);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img
        src={thumbnailSrc}
        alt={resource.title}
        className="h-48 w-full object-cover"
        loading="lazy"
      />

      <div className="space-y-3 p-5">
        <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
        <p className="text-sm leading-6 text-gray-600">{resource.description}</p>

        <div className="flex items-center gap-3">
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Download PDF
          </a>
          <Link
            to={`/resources/${resource.slug}`}
            className="text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
