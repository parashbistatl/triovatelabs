import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  body: text("body"),
  author: text("author"),
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const agreements = pgTable("agreements", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  variables: jsonb("variables").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
