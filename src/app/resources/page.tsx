import Link from "next/link";
import resourcesData from "@/data/resources.json";
import type { ResourceItem } from "@/components/content-types";

const resources = resourcesData as ResourceItem[];

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Resources</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">Free Downloads</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <article key={resource.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <img src={resource.thumbnail} alt={resource.title} className="h-48 w-full object-cover" />
            <div className="space-y-3 p-5">
              <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
              <p className="text-sm leading-6 text-gray-600">{resource.description}</p>
              <div className="flex items-center gap-3">
                <a
                  href={resource.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800"
                >
                  Download PDF
                </a>
                <Link href={`/resources/${resource.slug}`} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                  View details
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
