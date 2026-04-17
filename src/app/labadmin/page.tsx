import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function LabAdminRoot() {
  const session = await auth()

  if (session) {
    redirect("/labadmin/dashboard")
  }

  redirect("/labadmin/login")
}
