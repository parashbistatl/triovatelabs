"use client"

import "@uploadthing/react/styles.css"
import { FormEvent, useEffect, useState } from "react"
import { UploadButton } from "@/components/admin/UploadButton"

type ResourceFormProps = {
  onSuccess: () => void
  onCancel: () => void
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

export default function ResourceForm({ onSuccess, onCancel }: ResourceFormProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setSlug(slugify(title))
  }, [title])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    const response = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, description, thumbnail, pdfUrl }),
    })

    setIsSaving(false)

    if (response.ok) {
      onSuccess()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-gray-900 p-6">
        <h2 className="text-xl font-bold text-white">Add New Resource</h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" required />
          <input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="Slug" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white" />

          <div className="space-y-2">
            <p className="text-sm text-gray-300">Thumbnail Upload</p>
            <UploadButton
              endpoint="imageUploader"
              className="ut-button:bg-yellow-400 ut-button:text-black ut-button:hover:bg-yellow-300 ut-allowed-content:text-gray-400"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.serverData?.url
                if (url) setThumbnail(url)
              }}
            />
            {thumbnail && <img src={thumbnail} alt="Thumbnail preview" className="h-20 w-20 rounded object-cover" />}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-300">PDF Upload</p>
            <UploadButton
              endpoint="pdfUploader"
              className="ut-button:bg-yellow-400 ut-button:text-black ut-button:hover:bg-yellow-300 ut-allowed-content:text-gray-400"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.serverData?.url
                if (url) setPdfUrl(url)
              }}
            />
            {pdfUrl && <p className="text-sm text-green-400">PDF uploaded</p>}
          </div>

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
