"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/labadmin/login" })}
      className="w-full rounded-lg px-4 py-2 text-left text-red-400 hover:bg-gray-800"
    >
      Logout
    </button>
  )
}
