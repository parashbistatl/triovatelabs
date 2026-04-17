"use client"

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasError = Boolean(searchParams.get("error"))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/labadmin/dashboard",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8">
        <h1 className="text-2xl font-bold text-white">Lab Admin</h1>
        <p className="mt-1 text-sm text-gray-400">Sign in to continue</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none"
            required
          />

          {hasError && <p className="text-sm text-red-400">Invalid email or password</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
