"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BlogForm from "@/components/admin/BlogForm"

type Blog = {
  id: number
  title: string
  author: string | null
  publishedAt: string | null
  slug: string
  excerpt: string | null
  body: string | null
  coverImage: string | null
}

type BlogsClientProps = {
  blogs: Blog[]
}

export default function BlogsClient({ blogs }: BlogsClientProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | undefined>(undefined)

  const closeModal = () => {
    setOpen(false)
    setEditingBlog(undefined)
  }

  const openCreate = () => {
    setEditingBlog(undefined)
    setOpen(true)
  }

  const openEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setOpen(true)
  }

  const onSuccess = () => {
    closeModal()
    router.refresh()
  }

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm("Delete this blog?")
    if (!shouldDelete) return

    const response = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Blogs</h1>
        <button onClick={openCreate} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300">
          Create New Blog
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Title</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Author</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Published Date</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-950">
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td className="px-4 py-3 text-sm text-white">{blog.title}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{blog.author ?? "-"}</td>
                <td className="px-4 py-3 text-sm text-gray-300">{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(blog)} className="rounded-md border border-gray-700 px-3 py-1 text-gray-200 hover:bg-gray-800">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="rounded-md border border-red-700 px-3 py-1 text-red-400 hover:bg-gray-800">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <BlogForm blog={editingBlog} onSuccess={onSuccess} onCancel={closeModal} />}
    </section>
  )
}
