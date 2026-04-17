import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),

  pdfUploader: f({ pdf: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({ url: file.url })),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
