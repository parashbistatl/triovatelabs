"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
    ],
    []
  );

  const isActive = (href: string) => pathname === href;
  const isBlogsActive = pathname.startsWith("/blogs");
  const isResourcesActive = pathname.startsWith("/resources");
  const isBlogsResourcesActive = isBlogsActive || isResourcesActive;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    navLinks.forEach((link) => router.prefetch(link.href));
    router.prefetch("/blogs");
    router.prefetch("/resources");
    router.prefetch("/contact");
  }, [navLinks, router]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current) return;
      const target = event.target as Node;
      if (dropdownRef.current.contains(target)) return;
      setDesktopDropdownOpen(false);
      setMobileDropdownOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  const mountNode = document.getElementById("floating-ui-root");
  if (!mountNode) return null;

  const isHome = pathname === "/";

  const openDesktopDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDesktopDropdownOpen(true);
  };

  const closeDesktopDropdownWithDelay = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setDesktopDropdownOpen(false);
    }, 180);
  };

  if (isMobile) {
    return createPortal(
      <nav
        aria-label="Primary navigation"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 100000,
          pointerEvents: "none",
          isolation: "isolate",
        }}
      >
        <div className="pointer-events-auto">
          <Sheet
            open={mobileMenuOpen}
            onOpenChange={(open) => {
              setMobileMenuOpen(open);
              if (!open) setMobileDropdownOpen(false);
            }}
          >
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-full p-3 shadow-lg"
                style={{
                  background: isHome ? "rgba(10,22,40,0.9)" : "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff",
                }}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] border-l border-white/10 bg-[#0A1628] p-0">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                  <span className="text-lg font-semibold text-white">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col space-y-1 p-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div ref={dropdownRef} className="mt-1">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={mobileDropdownOpen}
                      onClick={() => setMobileDropdownOpen((prev) => !prev)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium transition-all duration-200 ${
                        isBlogsResourcesActive
                          ? "bg-white/10 text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>Blogs & Resources</span>
                      <span aria-hidden="true" className="text-xs">
                        {mobileDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {mobileDropdownOpen && (
                      <div role="menu" aria-label="Blogs and resources mobile menu" className="ml-3 mt-1 space-y-1">
                        <Link
                          href="/blogs"
                          role="menuitem"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                            isBlogsActive
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          Blogs
                        </Link>
                        <Link
                          href="/resources"
                          role="menuitem"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                            isResourcesActive
                              ? "bg-white/10 text-white"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          Resources
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <Link
                      href="/contact#start"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-lg px-4 py-3 text-center text-base font-semibold text-[#0A1628]"
                      style={{
                        background: "#ffd51e",
                        boxShadow: "0 2px 8px rgba(255,213,30,0.3)",
                      }}
                    >
                      Get Started
                    </Link>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>,
      mountNode
    );
  }

  return createPortal(
    <nav
      aria-label="Primary navigation"
      style={{
        position: "fixed",
        bottom: "calc(24px + env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100000,
        pointerEvents: "none",
        isolation: "isolate",
      }}
    >
      <div
        className="pointer-events-auto rounded-full px-6 py-3"
        style={{
          background: "rgba(10,22,40,0.9)",
          backdropFilter: "blur(8px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(link.href) ? "text-white" : "text-white/60 hover:text-white/90"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{
                    background: "#ffd51e",
                    boxShadow: "0 0 8px rgba(255,213,30,0.6)",
                  }}
                />
              )}
            </Link>
          ))}

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={openDesktopDropdown}
            onMouseLeave={closeDesktopDropdownWithDelay}
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={desktopDropdownOpen}
              onClick={() => setDesktopDropdownOpen((prev) => !prev)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isBlogsResourcesActive ? "text-white" : "text-white/60 hover:text-white/90"
              }`}
            >
              Blogs & Resources
              <span aria-hidden="true" className="text-[10px]">
                {desktopDropdownOpen ? "▲" : "▼"}
              </span>
              {isBlogsResourcesActive && (
                <span
                  className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                  style={{
                    background: "#ffd51e",
                    boxShadow: "0 0 8px rgba(255,213,30,0.6)",
                  }}
                />
              )}
            </button>

            {desktopDropdownOpen && (
              <div
                role="menu"
                aria-label="Blogs and resources menu"
                onMouseEnter={openDesktopDropdown}
                onMouseLeave={closeDesktopDropdownWithDelay}
                className="absolute bottom-full left-1/2 z-50 mb-2 min-w-[160px] -translate-x-1/2 rounded-xl border border-yellow-400/20 bg-[#0f1623] p-2 shadow-[0_16px_36px_rgba(0,0,0,0.45)]"
              >
                <div className="space-y-1">
                  <Link
                    href="/blogs"
                    role="menuitem"
                    className={`block rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-white/5 hover:text-yellow-400 ${
                      isBlogsActive ? "bg-white/5 text-yellow-400" : ""
                    }`}
                  >
                    Blogs
                  </Link>
                  <Link
                    href="/resources"
                    role="menuitem"
                    className={`block rounded-lg px-4 py-2 text-sm text-white transition-colors hover:bg-white/5 hover:text-yellow-400 ${
                      isResourcesActive ? "bg-white/5 text-yellow-400" : ""
                    }`}
                  >
                    Resources
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-white/10" />

          <Link
            href="/contact#start"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold"
            style={{
              background: "#ffd51e",
              color: "#0A1628",
              boxShadow: "0 2px 8px rgba(255,213,30,0.3)",
              transition: "transform 120ms cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>,
    mountNode
  );
};

export default Navigation;
