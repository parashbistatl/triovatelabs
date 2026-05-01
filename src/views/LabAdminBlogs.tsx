"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ImagePlus } from "lucide-react";
import type { BlogPost, ContentStatus } from "@/components/content-types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

type LabAdminBlogsProps = {
  initialBlogs?: BlogPost[];
};

export default function LabAdminBlogs({ initialBlogs = [] }: LabAdminBlogsProps) {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<ContentStatus>("published");
  const [activeFilter, setActiveFilter] = useState<"all" | ContentStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az" | "za">("newest");
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [coverImage, setCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverInputKey, setCoverInputKey] = useState(0);
  const [inlineImageAlt, setInlineImageAlt] = useState("");
  const [inlineImageInputKey, setInlineImageInputKey] = useState(0);
  const [isUploadingInlineImage, setIsUploadingInlineImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/blogs", { cache: "no-store" });
      if (!response.ok) {
        toast.error("Failed to load blogs");
        return;
      }
      const data = (await response.json()) as BlogPost[];
      setBlogs(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  useEffect(() => {
    if (!editingId) {
      setSlug(slugify(title));
    }
  }, [title, editingId]);

  useEffect(() => {
    if (!coverImageFile) return;
    const preview = URL.createObjectURL(coverImageFile);
    setCoverImage(preview);
    return () => URL.revokeObjectURL(preview);
  }, [coverImageFile]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setAuthor("");
    setExcerpt("");
    setBody("");
    setStatus("published");
    setPublishedAt(new Date().toISOString().slice(0, 10));
    setCoverImage("");
    setCoverImageFile(null);
    setCoverInputKey((prev) => prev + 1);
    setInlineImageAlt("");
    setInlineImageInputKey((prev) => prev + 1);
    setEditingId(null);
  };

  const insertIntoBody = (snippet: string) => {
    const textarea = bodyTextareaRef.current;

    if (!textarea) {
      setBody((prev) => `${prev}${prev.trim() ? "\n\n" : ""}${snippet}`);
      return;
    }

    const start = textarea.selectionStart ?? body.length;
    const end = textarea.selectionEnd ?? body.length;
    const nextBody = `${body.slice(0, start)}${snippet}${body.slice(end)}`;
    setBody(nextBody);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + snippet.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const handleInlineImageUpload = async (file: File | null) => {
    if (!file) return;

    setIsUploadingInlineImage(true);
    try {
      const imageUrl = await uploadImage(file);
      const altText = inlineImageAlt.trim() || "Blog image";
      const snippet = `\n\n![${altText}](${imageUrl})\n\n`;
      insertIntoBody(snippet);
      setInlineImageInputKey((prev) => prev + 1);
      toast.success("Inline image uploaded and inserted into the blog body");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload inline image");
    } finally {
      setIsUploadingInlineImage(false);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as { error?: string; detail?: string } | null;
      throw new Error(errorBody?.detail || errorBody?.error || "Image upload failed");
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedSlug = slugify(slug || title);

    if (!coverImage && !coverImageFile) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsSaving(true);

    try {
      let finalCover = coverImage;
      if (coverImageFile) {
        finalCover = await uploadImage(coverImageFile);
      }

      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title,
          slug: normalizedSlug,
          author,
          excerpt,
          body,
          status,
          publishedAt,
          coverImage: finalCover,
        }),
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(errorBody?.error || "Failed to save blog");
      }

      await loadBlogs();
      toast.success(editingId ? "Blog updated" : "Blog created");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };

  const onEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setAuthor(blog.author);
    setExcerpt(blog.excerpt);
    setBody(blog.body);
    setStatus(normalizeStatus(blog.status));
    setPublishedAt(blog.publishedAt);
    setCoverImage(blog.coverImage);
    setCoverImageFile(null);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this blog?")) return;

    setBlogs((prev) => prev.filter((blog) => blog.id !== id));
    const response = await fetch(`/api/admin/blogs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      await loadBlogs();
      toast.error("Failed to delete blog");
      return;
    }

    await loadBlogs();
    toast.success("Blog deleted");
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBlogs = blogs.filter((blog) => {
    const statusMatch = activeFilter === "all" ? true : normalizeStatus(blog.status) === activeFilter;
    const searchMatch = !normalizedSearch
      ? true
      : [blog.title, blog.author, blog.slug, blog.excerpt, blog.body]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

    return statusMatch && searchMatch;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
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
    setSortBy("az");
    setActiveFilter("published");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-yellow-400">Manage Blogs</h1>
            <p className="text-sm text-gray-400">Create and maintain blog entries</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:py-8 lg:grid-cols-[440px_1fr]">
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit Blog" : "Add Blog"}</h2>
          <p className="mt-1 text-sm text-gray-400">Fill all required fields to publish or save as draft.</p>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt" rows={3} className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none" required />

            <div className="space-y-3 rounded-xl border border-gray-800 bg-gray-950 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Article Body</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Use markdown for headings, lists, links, quotes, code blocks, and inline images.
                  </p>
                </div>
                <div className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-400">
                  Cover image stays separate. Use inline images for article sections.
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  value={inlineImageAlt}
                  onChange={(e) => setInlineImageAlt(e.target.value)}
                  placeholder="Inline image alt text"
                  className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none"
                />
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/90 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                  <ImagePlus className="h-4 w-4" />
                  {isUploadingInlineImage ? "Uploading..." : "Upload Inline Image"}
                  <input
                    key={inlineImageInputKey}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingInlineImage}
                    onChange={(e) => {
                      void handleInlineImageUpload(e.target.files?.[0] ?? null);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>

              <textarea
                ref={bodyTextareaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`# Blog heading

Write your introduction here.

## Section heading

- Point one
- Point two

![Image alt text](https://example.com/image.jpg)

\`\`\`
Code block
\`\`\``}
                rows={14}
                className="w-full rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 font-mono text-sm text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-gray-700 bg-gray-800/90 px-3 py-2 text-left text-sm text-white focus:border-yellow-400 focus:outline-none"
                  >
                    {publishedAt ? format(new Date(publishedAt), "PPP") : "Select publish date"}
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto border-gray-700 bg-gray-900 p-0 text-white">
                  <Calendar
                    mode="single"
                    selected={publishedAt ? new Date(publishedAt) : undefined}
                    onSelect={(date) => {
                      if (date) setPublishedAt(date.toISOString().slice(0, 10));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Select value={status} onValueChange={(value) => setStatus(value as ContentStatus)}>
                <SelectTrigger className="w-full rounded-xl border-gray-700 bg-gray-800/90 px-3 py-2 text-white focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-900 text-white">
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 rounded-xl border border-gray-800 bg-gray-950 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">Cover Image Upload</p>
              <input key={coverInputKey} type="file" accept="image/*" onChange={(e) => setCoverImageFile(e.target.files?.[0] ?? null)} className="w-full text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-gray-800 file:px-3 file:py-2 file:text-sm file:text-gray-200" />
              {coverImage && <img src={coverImage} alt="Cover preview" className="h-28 w-full rounded object-cover" />}
            </div>

            <div className="grid gap-2 sm:flex">
              <button type="submit" disabled={isSaving} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60">
                {isSaving ? "Saving..." : editingId ? "Update Blog" : "Add Blog"}
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
              <div className="flex w-full flex-col gap-2 sm:max-w-2xl sm:flex-row">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search title, author, slug, excerpt..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
                />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "az" | "za")}>
                  <SelectTrigger className="w-full rounded-lg border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:ring-0 focus:ring-offset-0 sm:w-44">
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
                Showing {filteredBlogs.length} of {blogs.length}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={applyDraftReviewPreset} className="labadmin-filter-chip labadmin-filter-chip-amber rounded-full px-3 py-1 text-xs">
                Draft Review
              </button>
              <button type="button" onClick={applyPublishedLibraryPreset} className="labadmin-filter-chip labadmin-filter-chip-emerald rounded-full px-3 py-1 text-xs">
                Published Library
              </button>
              <button type="button" onClick={clearListControls} className="labadmin-filter-chip rounded-full px-3 py-1 text-xs">
                Clear All
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Blog List ({filteredBlogs.length})</h2>
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
          <div className="mt-4 overflow-x-auto hidden md:block">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading blogs...</div>
            ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-400">Title</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-400">Author</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-400">Status</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-400">Published</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-400">Slug</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sortedBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td className="px-3 py-2 text-sm">{blog.title}</td>
                    <td className="px-3 py-2 text-sm text-gray-300">{blog.author}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${normalizeStatus(blog.status) === "draft" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                        {normalizeStatus(blog.status)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-300">{new Date(blog.publishedAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-sm text-gray-300">{blog.slug}</td>
                    <td className="px-3 py-2 text-sm">
                      <div className="flex gap-2">
                        <button onClick={() => onEdit(blog)} className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-800">
                          Edit
                        </button>
                        <button onClick={() => void onDelete(blog.id)} className="rounded-md border border-red-700 px-2 py-1 text-xs text-red-400 hover:bg-gray-800">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-sm text-gray-400">
                      No blogs yet. Add your first blog from the left form.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
            {sortedBlogs.length === 0 && blogs.length > 0 && (
              <div className="py-8 text-center text-sm text-gray-400">
                No matching blogs for current search/filters.
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {isLoading ? (
              <p className="text-center text-sm text-gray-400">Loading blogs...</p>
            ) : (
              <>
            {sortedBlogs.map((blog) => (
              <article key={blog.id} className="rounded-xl border border-gray-800 bg-gray-950 p-3">
                <h3 className="text-sm font-semibold text-white">{blog.title}</h3>
                <p className="mt-1 text-xs text-gray-300">By {blog.author}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${normalizeStatus(blog.status) === "draft" ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                    {normalizeStatus(blog.status)}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(blog.publishedAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 truncate text-xs text-gray-400">/{blog.slug}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={() => onEdit(blog)} className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-200 hover:bg-gray-800">
                    Edit
                  </button>
                  <button onClick={() => void onDelete(blog.id)} className="rounded-md border border-red-700 px-2 py-1 text-xs text-red-400 hover:bg-gray-800">
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {blogs.length === 0 && <p className="text-center text-sm text-gray-400">No blogs yet. Add your first blog from the form above.</p>}
            {sortedBlogs.length === 0 && blogs.length > 0 && <p className="text-center text-sm text-gray-400">No matching blogs for current search/filters.</p>}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
