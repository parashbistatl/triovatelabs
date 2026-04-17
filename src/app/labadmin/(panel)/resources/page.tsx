import { desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { resources } from "@/lib/schema"
import ResourcesClient from "@/components/admin/ResourcesClient"

export default async function ResourcesPage() {
  const resourceRows = await db.select().from(resources).orderBy(desc(resources.createdAt))
  return <ResourcesClient resources={resourceRows} />
}
