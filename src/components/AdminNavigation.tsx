"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useLabAdminTheme } from "@/components/admin/LabAdminThemeProvider";

const links = [
  { href: "/labadmin/dashboard", label: "Dashboard" },
  { href: "/labadmin/blogs", label: "Blogs" },
  { href: "/labadmin/resources", label: "Resources" },
  { href: "/labadmin/agreements", label: "Agreements" },
];

export default function AdminNavigation() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useLabAdminTheme();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    links.forEach((link) => router.prefetch(link.href));
  }, [router]);

  const handleLogout = async () => {
    await signOut({ redirect: false, callbackUrl: "/labadmin/login" });
    router.replace("/labadmin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-[100000] border-b border-gray-800 bg-gray-950/95 backdrop-blur labadmin-nav">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/labadmin/dashboard" className="labadmin-brand font-semibold text-yellow-400">
          Lab Admin
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Admin navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`labadmin-nav-link rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-yellow-400 text-black"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={toggleTheme}
            className="labadmin-nav-link ml-2 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-white"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          <Link
            href="/"
            className="labadmin-nav-link ml-2 rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            View Site
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="labadmin-nav-danger ml-2 rounded-lg border border-red-700 px-3 py-2 text-sm text-red-400 hover:bg-gray-800"
          >
            Logout
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="labadmin-nav-link inline-flex items-center justify-center rounded-lg border border-gray-700 p-2 text-gray-200 md:hidden"
          aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-gray-800 px-4 py-3 md:hidden" aria-label="Admin mobile navigation">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`labadmin-nav-link rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-yellow-400 text-black"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={toggleTheme}
              className="labadmin-nav-link inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
            <Link
              href="/"
              className="labadmin-nav-link rounded-lg border border-gray-700 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-white"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="labadmin-nav-danger rounded-lg border border-red-700 px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
