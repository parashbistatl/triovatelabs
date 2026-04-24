"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ResourceItem, ContentStatus } from "@/components/content-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const normalizeStatus = (value: unknown): ContentStatus =>
  String(value || "").trim().toLowerCase() === "draft" ? "draft" : "published";

type LabAdminResourcesProps = {
  initialResources?: ResourceItem[];
};

export default function LabAdminResources({ initialResources = [] }: LabAdminResourcesProps) {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ContentStatus>("published");
  const [activeFilter, setActiveFilter] = useState<"all" | ContentStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [pdfLabel, setPdfLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailInputKey, setThumbnailInputKey] = useState(0);
  const [pdfInputKey, setPdfInputKey] = useState(0);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/resources", { cache: "no-store" });
      if (!response.ok) {
        toast.error("Failed to load resources");
        return;
      }
      const data = (await response.json()) as ResourceItem[];
      setResources(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!editingId) {
      setSlug(slugify(title));
    }
  }, [title, editingId]);

  useEffect(() => {
    void loadResources();
  }, []);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview("");
      return;
    }

    const preview = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(preview);
    return () => URL.revokeObjectURL(preview);
  }, [thumbnailFile]);

  const uploadFile = async (path: "image" | "pdf", file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/admin/upload/${path}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as { error?: string; detail?: string } | null;
      throw new Error(errorBody?.detail || errorBody?.error || `Failed to upload ${path}`);
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingId && (!thumbnailFile || !pdfFile)) {
      toast.error("Please upload both thumbnail and PDF");
      return;
    }

    setIsSaving(true);

    try {
      const thumbnail = thumbnailFile
        ? await uploadFile("image", thumbnailFile)
        : thumbnailUrl;
      const pdf = pdfFile ? await uploadFile("pdf", pdfFile) : pdfUrl;

      if (!thumbnail || !pdf) {
        throw new Error("Thumbnail and PDF are required.");
      }

      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          slug: slugify(slug || title),
          description,
          status,
          thumbnail,
          pdfUrl: pdf,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorBody?.error || "Failed to save resource");
      }

      await loadResources();
      toast.success(editingId ? "Resource updated" : "Resource created");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save resource");
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = (item: ResourceItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setDescription(item.description);
    setStatus(normalizeStatus(item.status));
    setThumbnailFile(null);
    setPdfFile(null);
    setThumbnailUrl(item.thumbnail);
    setPdfUrl(item.pdfUrl);
    setThumbnailPreview(item.thumbnail);
    setPdfLabel(item.pdfUrl ? "Current PDF attached" : "");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setStatus("published");
    setThumbnailFile(null);
    setPdfFile(null);
    setThumbnailUrl("");
    setPdfUrl("");
    setThumbnailPreview("");
    setPdfLabel("");
    setThumbnailInputKey((prev) => prev + 1);
    setPdfInputKey((prev) => prev + 1);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this resource?")) return;

    setResources((prev) => prev.filter((resource) => resource.id !== id));
    const response = await fetch(`/api/admin/resources/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      await loadResources();
      toast.error("Failed to delete resource");
      return;
    }

    await loadResources();
    toast.success("Resource deleted");
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredResources = resources.filter((item) => {
    const statusMatch = activeFilter === "all" ? true : normalizeStatus(item.status) === activeFilter;
    const searchMatch = !normalizedSearch
      ? true
      : [item.title, item.slug, item.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

    return statusMatch && searchMatch;
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

  const clearListControls = () => {
    setSearchTerm("");
    setSortBy("newest");
    setActiveFilter("all");
  };

  const applyDraftReviewPreset = () => {
    setSearchTerm("");
    setSortBy("newest");
    setActiveFilter("draft");
  };

  const applyPublishedLibraryPreset = () => {
    setSearchTerm("");
    setSortBy("newest");
    setActiveFilter("published");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Manage Resources</h1>
            <p className="text-sm text-gray-400">Add downloadable resources from admin</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:py-8 lg:grid-cols-[440px_1fr]">
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
          <h2 className="text-lg font-semibold">{editingId ? "Edit Resource" : "Add Resource"}</h2>
          <p className="mt-1 text-sm text-gray-400">Control publication status and keep assets production-ready.</p>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />

            <Select value={status} onValueChange={(value) => setStatus(value as ContentStatus)}>
              <SelectTrigger className="w-full rounded-xl border-gray-700 bg-gray-800/90 px-3 py-2 text-white focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-900 text-white">
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2 rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">Thumbnail Upload</p>
              <input key={thumbnailInputKey} type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-sm file:text-gray-200" />
              {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="h-24 w-full rounded object-cover" />}
            </div>

            <div className="space-y-2 rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">PDF Upload</p>
              <input
                key={pdfInputKey}
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setPdfFile(file);
                  setPdfLabel(file?.name || "");
                }}
                className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-sm file:text-gray-200"
              />
              {pdfLabel && <p className="text-sm text-green-400">PDF uploaded: {pdfLabel}</p>}
            </div>

            <div className="grid gap-2 sm:flex">
              <button type="submit" disabled={isSaving} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
                {isSaving ? "Saving..." : editingId ? "Update Resource" : "Add Resource"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:bg-gray-800">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
          <div className="mb-4 rounded-xl border border-gray-800 bg-gray-950 p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search title, slug, description..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "az" | "za")}>
                  <SelectTrigger className="w-full rounded-lg border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:ring-0 focus:ring-offset-0 sm:w-40">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-900 text-white">
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="az">Title A-Z</SelectItem>
                    <SelectItem value="za">Title Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-400">
                Showing {filteredResources.length} of {resources.length}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={applyDraftReviewPreset} className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-200 hover:bg-amber-500/20">
                Draft Review
              </button>
              <button type="button" onClick={applyPublishedLibraryPreset} className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-500/20">
                Published Library
              </button>
              <button type="button" onClick={clearListControls} className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs text-gray-300 hover:bg-gray-800">
                Clear All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Resource List ({filteredResources.length})</h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setActiveFilter("all")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === "all" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}>
                All
              </button>
              <button type="button" onClick={() => setActiveFilter("published")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === "published" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}>
                Published
              </button>
              <button type="button" onClick={() => setActiveFilter("draft")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === "draft" ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}>
                Draft
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {isLoading ? (
              <p className="text-sm text-gray-400">Loading resources...</p>
            ) : (
              <>
            {sortedResources.map((item) => (
              <article key={item.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-28 w-full rounded object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x300?text=No+Image";
                  }}
                />
                <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
                <p className="mt-1">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${normalizeStatus(item.status) === "draft" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                    {normalizeStatus(item.status)}
                  </span>
                </p>
                <p className="mt-1 line-clamp-3 text-sm text-gray-300">{item.description}</p>
                <a href={item.pdfUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-yellow-400 hover:text-yellow-300">
                  Open PDF
                </a>
                <div className="mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onEdit(item)} className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-800">
                      Edit
                    </button>
                    <button onClick={() => void onDelete(item.id)} className="rounded-md border border-red-700 px-2 py-1 text-xs text-red-400 hover:bg-gray-800">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {resources.length === 0 && <p className="text-sm text-gray-400">No resources yet. Add one from the left form.</p>}
            {sortedResources.length === 0 && resources.length > 0 && <p className="text-sm text-gray-400">No matching resources for current search/filters.</p>}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
