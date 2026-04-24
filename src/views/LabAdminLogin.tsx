"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LabAdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/labadmin/dashboard",
    });

    if (!result || result.error) {
      setError("Invalid email or password");
      setIsSubmitting(false);
      return;
    }

    router.replace("/labadmin/dashboard");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(251,191,36,0.15), transparent 35%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.12), transparent 35%)" }} />
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900/95 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Lab Admin</h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 pr-12 text-white placeholder:text-gray-500 focus:border-yellow-400 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-md border px-2 py-1 transition ${
                showPassword
                  ? "border-yellow-400/80 bg-yellow-400/20 text-yellow-300"
                  : "border-gray-600 bg-gray-800/80 text-gray-300 hover:border-gray-500 hover:text-white"
              }`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

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
  );
}
