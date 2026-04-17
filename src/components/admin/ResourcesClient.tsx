"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ResourceForm from "@/components/admin/ResourceForm"

type Resource = {
  id: number
  title: string
  description: string | null
  thumbnail: string | null
  pdfUrl: string | null
}

type ResourcesClientProps = {
  resources: Resource[]
}

export default function ResourcesClient({ resources }: ResourcesClientProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm("Delete this resource?")
    if (!shouldDelete) return

    const response = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" })

    if (response.ok) {
      router.refresh()
    }
  }

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Resources</h1>
        <button onClick={() => setOpen(true)} className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black hover:bg-yellow-300">
          Add New Resource
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource) => (
          <article key={resource.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-start gap-3">
              <img
                src={resource.thumbnail || "https://placehold.co/80x80?text=No+Image"}
                alt={resource.title}
                className="h-20 w-20 rounded object-cover"
              />

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold text-white">{resource.title}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-gray-300">{resource.description || "No description"}</p>
                {resource.pdfUrl && (
                  <a href={resource.pdfUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-yellow-400 hover:text-yellow-300">
                    Open PDF
                  </a>
                )}
              </div>
            </div>

            <button onClick={() => handleDelete(resource.id)} className="mt-4 rounded-md border border-red-700 px-3 py-1 text-sm text-red-400 hover:bg-gray-800">
              Delete
            </button>
          </article>
        ))}
      </div>

      {open && <ResourceForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />}
    </section>
  )
}
