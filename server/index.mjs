import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { UTApi, UTFile } from "uploadthing/server";

dotenv.config({ path: ".env.local" });
dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 8787);
const publicApiOrigin = process.env.API_PUBLIC_URL || `http://localhost:${port}`;
const localUploadsDir = path.resolve(process.cwd(), "uploads");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Set it in .env.local.");
}

const sql = neon(process.env.DATABASE_URL);
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 24 * 1024 * 1024 },
});

app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(localUploadsDir));

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS site_blogs (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      body TEXT NOT NULL,
      author TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      published_at DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE site_blogs
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
  `;

  await sql`
    UPDATE site_blogs
    SET status = CASE
      WHEN LOWER(TRIM(COALESCE(status, ''))) = 'draft' THEN 'draft'
      ELSE 'published'
    END
    ;
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_resources (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      pdf_url TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    ALTER TABLE site_resources
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
  `;

  await sql`
    UPDATE site_resources
    SET status = CASE
      WHEN LOWER(TRIM(COALESCE(status, ''))) = 'draft' THEN 'draft'
      ELSE 'published'
    END
    ;
  `;
}

function toIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function normalizeStatusValue(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (raw === "draft") return "draft";
  if (raw === "published") return "published";
  return null;
}

function normalizeBlog(row) {
  const status = normalizeStatusValue(row.status) || "published";
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt),
    body: String(row.body),
    author: String(row.author),
    coverImage: String(row.cover_image),
    status,
    publishedAt: toIsoDate(row.published_at),
  };
}

function normalizeResource(row) {
  const status = normalizeStatusValue(row.status) || "published";
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    thumbnail: String(row.thumbnail),
    pdfUrl: String(row.pdf_url),
    status,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/content/blogs", async (_req, res) => {
  try {
    const rows = await sql`
      SELECT * FROM site_blogs
      WHERE status = 'published'
      ORDER BY published_at DESC, created_at DESC
    `;
    res.json(rows.map(normalizeBlog));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs", detail: String(error) });
  }
});

app.get("/api/content/resources", async (_req, res) => {
  try {
    const rows = await sql`
      SELECT * FROM site_resources
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    res.json(rows.map(normalizeResource));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resources", detail: String(error) });
  }
});

app.get("/api/admin/blogs", async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM site_blogs ORDER BY published_at DESC, created_at DESC`;
    res.json(rows.map(normalizeBlog));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs", detail: String(error) });
  }
});

app.post("/api/admin/blogs", async (req, res) => {
  try {
    const payload = req.body || {};
    const id = payload.id || `admin-blog-${Date.now()}`;
    const title = String(payload.title || "").trim();
    const slug = String(payload.slug || "").trim();
    const excerpt = String(payload.excerpt || "").trim();
    const body = String(payload.body || "").trim();
    const author = String(payload.author || "").trim();
    const coverImage = String(payload.coverImage || "").trim();

    if (!slug) {
      res.status(400).json({ error: "Slug is required" });
      return;
    }

    if (!title || !excerpt || !body || !author || !coverImage) {
      res.status(400).json({ error: "Title, excerpt, body, author, and cover image are required" });
      return;
    }

    const slugConflict = await sql`
      SELECT id
      FROM site_blogs
      WHERE slug = ${slug}
        AND id <> ${id}
      LIMIT 1
    `;

    if (slugConflict.length > 0) {
      res.status(409).json({ error: "Slug already exists. Use a unique slug." });
      return;
    }

    const status = normalizeStatusValue(payload.status);
    if (!status) {
      res.status(400).json({ error: "Status must be either 'draft' or 'published'" });
      return;
    }

    const rows = await sql`
      INSERT INTO site_blogs (id, slug, title, excerpt, body, author, cover_image, status, published_at)
      VALUES (
        ${id},
        ${slug},
        ${title},
        ${excerpt},
        ${body},
        ${author},
        ${coverImage},
        ${status},
        ${toIsoDate(payload.publishedAt)}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        body = EXCLUDED.body,
        author = EXCLUDED.author,
        cover_image = EXCLUDED.cover_image,
        status = EXCLUDED.status,
        published_at = EXCLUDED.published_at
      RETURNING *;
    `;

    res.json(normalizeBlog(rows[0]));
  } catch (error) {
    res.status(500).json({ error: "Failed to save blog", detail: String(error) });
  }
});

app.delete("/api/admin/blogs/:id", async (req, res) => {
  try {
    await sql`DELETE FROM site_blogs WHERE id = ${String(req.params.id)}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog", detail: String(error) });
  }
});

app.get("/api/admin/resources", async (_req, res) => {
  try {
    const rows = await sql`SELECT * FROM site_resources ORDER BY created_at DESC`;
    res.json(rows.map(normalizeResource));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resources", detail: String(error) });
  }
});

app.post("/api/admin/resources", async (req, res) => {
  try {
    const payload = req.body || {};
    const id = payload.id || `admin-resource-${Date.now()}`;
    const title = String(payload.title || "").trim();
    const slug = String(payload.slug || "").trim();
    const description = String(payload.description || "").trim();
    const thumbnail = String(payload.thumbnail || "").trim();
    const pdfUrl = String(payload.pdfUrl || "").trim();

    if (!slug) {
      res.status(400).json({ error: "Slug is required" });
      return;
    }

    if (!title || !description || !thumbnail || !pdfUrl) {
      res.status(400).json({ error: "Title, description, thumbnail, and PDF are required" });
      return;
    }

    const slugConflict = await sql`
      SELECT id
      FROM site_resources
      WHERE slug = ${slug}
        AND id <> ${id}
      LIMIT 1
    `;

    if (slugConflict.length > 0) {
      res.status(409).json({ error: "Slug already exists. Use a unique slug." });
      return;
    }

    const status = normalizeStatusValue(payload.status);
    if (!status) {
      res.status(400).json({ error: "Status must be either 'draft' or 'published'" });
      return;
    }

    const rows = await sql`
      INSERT INTO site_resources (id, slug, title, description, thumbnail, pdf_url, status)
      VALUES (
        ${id},
        ${slug},
        ${title},
        ${description},
        ${thumbnail},
        ${pdfUrl},
        ${status}
      )
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        thumbnail = EXCLUDED.thumbnail,
        pdf_url = EXCLUDED.pdf_url,
        status = EXCLUDED.status
      RETURNING *;
    `;

    res.json(normalizeResource(rows[0]));
  } catch (error) {
    res.status(500).json({ error: "Failed to save resource", detail: String(error) });
  }
});

app.delete("/api/admin/resources/:id", async (req, res) => {
  try {
    await sql`DELETE FROM site_resources WHERE id = ${String(req.params.id)}`;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resource", detail: String(error) });
  }
});

async function uploadToLocal(file) {
  await mkdir(localUploadsDir, { recursive: true });

  const ext = path.extname(file.originalname || "") || (file.mimetype === "application/pdf" ? ".pdf" : ".bin");
  const filename = `${Date.now()}-${randomUUID()}${ext}`;
  const fullPath = path.join(localUploadsDir, filename);

  await writeFile(fullPath, file.buffer);

  return {
    key: `local-${filename}`,
    url: `${publicApiOrigin}/uploads/${filename}`,
    provider: "local",
  };
}

async function uploadFileWithFallback(file) {
  if (!process.env.UPLOADTHING_TOKEN) {
    return uploadToLocal(file);
  }

  const utFile = new UTFile([file.buffer], file.originalname, {
    type: file.mimetype,
    lastModified: Date.now(),
  });

  try {
    const result = await utapi.uploadFiles(utFile);

    if (!result || result.error || !result.data) {
      throw new Error(result?.error?.message || "UploadThing upload failed");
    }

    return {
      key: result.data.key,
      url: result.data.ufsUrl || result.data.url,
      provider: "uploadthing",
    };
  } catch (error) {
    console.error("UploadThing failed, using local upload fallback:", error);
    return uploadToLocal(file);
  }
}

app.post("/api/admin/upload/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Image file is required" });
      return;
    }

    if (!req.file.mimetype.startsWith("image/")) {
      res.status(400).json({ error: "Only image files are allowed" });
      return;
    }

    const uploaded = await uploadFileWithFallback(req.file);
    res.json(uploaded);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload image", detail: String(error) });
  }
});

app.post("/api/admin/upload/pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "PDF file is required" });
      return;
    }

    if (req.file.mimetype !== "application/pdf") {
      res.status(400).json({ error: "Only PDF files are allowed" });
      return;
    }

    const uploaded = await uploadFileWithFallback(req.file);
    res.json(uploaded);
  } catch (error) {
    res.status(500).json({ error: "Failed to upload PDF", detail: String(error) });
  }
});

ensureTables()
  .then(() => {
    app.listen(port, () => {
      console.log(`[api] running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize API server", error);
    process.exit(1);
  });
