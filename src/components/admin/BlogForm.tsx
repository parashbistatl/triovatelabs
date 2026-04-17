"use client"

import { FormEvent, useEffect, useState } from "react"

type Blog = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  author: string | null
  coverImage: string | null
  publishedAt: string | null
}

type BlogFormProps = {
  blog?: Blog
  onSuccess: () => void
  onCancel: () => void
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

export default function BlogForm({ blog, onSuccess, onCancel }: BlogFormProps) {
  const [title, setTitle] = useState(blog?.title ?? "")
  const [slug, setSlug] = useState(blog?.slug ?? "")
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "")
  const [body, setBody] = useState(blog?.body ?? "")
  const [author, setAuthor] = useState(blog?.author ?? "")
  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? "")
  const [publishedAt, setPublishedAt] = useState(blog?.publishedAt?.slice(0, 10) ?? "")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!blog) {
      setSlug(slugify(title))
    }
  }, [title, blog])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const response = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: blog?.id,
        title,
        slug,
        excerpt,
        body,
        author,
        coverImage,
        publishedAt: publishedAt || null,
      }),
    })

    setIsSaving(false)

    if (response.ok) {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-gray-900 p-6">
        <h2 className="text-xl font-bold text-white">{blog ? "Edit Blog" : "Create Blog"}</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" required />
          <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="Slug" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" required />
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} placeholder="Excerpt" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} placeholder="Body" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Cover image URL" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />
          <input value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} type="date" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />

          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black disabled:opacity-60">
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
