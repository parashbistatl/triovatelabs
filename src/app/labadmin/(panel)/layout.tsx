import { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import LogoutButton from "@/components/admin/LogoutButton"

type PanelLayoutProps = {
  children: ReactNode
}

export default async function PanelLayout({ children }: PanelLayoutProps) {
  const session = await auth()

  if (!session) {
    redirect("/labadmin/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <aside className="flex h-screen w-[240px] flex-col border-r border-gray-800 bg-gray-900 p-4">
        <div>
          <h2 className="text-xl font-bold text-yellow-400">Lab Admin</h2>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="mt-8 space-y-2">
          <Link href="/labadmin/dashboard" className="block rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
            Dashboard
          </Link>
          <Link href="/labadmin/blogs" className="block rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
            Blogs
          </Link>
          <Link href="/labadmin/resources" className="block rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
            Resources
          </Link>
        </nav>

        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
