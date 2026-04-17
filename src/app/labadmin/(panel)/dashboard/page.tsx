import { db } from "@/lib/db"
import { blogs, resources } from "@/lib/schema"

export default async function DashboardPage() {
  const blogRows = await db.select().from(blogs)
  const resourceRows = await db.select().from(resources)

  return (
    <section>
      <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
          <p className="text-4xl font-bold text-yellow-400">{blogRows.length}</p>
          <p className="mt-1 text-sm text-gray-400">Total Blogs</p>
        </div>

        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
          <p className="text-4xl font-bold text-yellow-400">{resourceRows.length}</p>
          <p className="mt-1 text-sm text-gray-400">Total Resources</p>
        </div>
      </div>
    </section>
  )
}
