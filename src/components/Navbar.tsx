"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const isBlogsActive = pathname?.startsWith("/blogs");
  const isResourcesActive = pathname?.startsWith("/resources");
  const isBlogsResourcesActive = Boolean(isBlogsActive || isResourcesActive);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!navRef.current) return;
      const target = event.target as Node;
      if (navRef.current.contains(target)) return;

      setDesktopDropdownOpen(false);
      setMobileDropdownOpen(false);
      setMobileOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  useEffect(() => {
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div ref={navRef} className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Triovate Labs
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-700 ${
                pathname === "/" ? "text-blue-700" : "text-gray-700"
              }`}
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setDesktopDropdownOpen(true)}
              onMouseLeave={() => setDesktopDropdownOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={desktopDropdownOpen}
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-700 ${
                  isBlogsResourcesActive ? "text-blue-700" : "text-gray-700"
                }`}
                onClick={() => setDesktopDropdownOpen((prev) => !prev)}
              >
                Blogs & Resources
                <span aria-hidden="true" className="text-xs">
                  {desktopDropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {desktopDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Blogs and resources menu"
                  className="absolute right-0 mt-3 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-lg"
                >
                  <Link
                    href="/blogs"
                    role="menuitem"
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isBlogsActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/resources"
                    role="menuitem"
                    className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                      isResourcesActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Resources
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-gray-700 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-gray-200 py-3 md:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/" ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                Home
              </Link>

              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={mobileDropdownOpen}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium ${
                  isBlogsResourcesActive ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
              >
                <span>Blogs & Resources</span>
                <span aria-hidden="true" className="text-xs">
                  {mobileDropdownOpen ? "▲" : "▼"}
                </span>
              </button>

              {mobileDropdownOpen && (
                <div role="menu" aria-label="Blogs and resources mobile menu" className="ml-3 flex flex-col gap-1 py-1">
                  <Link
                    href="/blogs"
                    role="menuitem"
                    className={`rounded-md px-3 py-2 text-sm ${
                      isBlogsActive ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/resources"
                    role="menuitem"
                    className={`rounded-md px-3 py-2 text-sm ${
                      isResourcesActive ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                  >
                    Resources
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
