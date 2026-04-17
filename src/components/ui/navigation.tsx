import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
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

  const isActive = (href: string) => location.pathname === href;
  const isBlogsActive = location.pathname.startsWith("/blogs");
  const isResourcesActive = location.pathname.startsWith("/resources");
  const isBlogsResourcesActive = isBlogsActive || isResourcesActive;

  useEffect(() => setMounted(true), []);

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
  }, [location.pathname]);

  if (!mounted) return null;

  const mountNode = document.getElementById("floating-ui-root");
  if (!mountNode) return null;

  const isHome = location.pathname === "/";

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

  // Mobile: floating hamburger only (no full-width bar)
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
        <div
          className="pointer-events-auto"
        >
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
                  background: isHome
                    ? "rgba(10,22,40,0.9)"
                    : "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#ffffff",
                }}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] bg-[#0A1628] border-l border-white/10 p-0"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <span className="text-lg font-semibold text-white">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 flex flex-col p-6 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? "text-white bg-white/10"
                          : "text-white/70 hover:text-white hover:bg-white/5"
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
                      className={`w-full px-4 py-3 rounded-lg text-base font-medium text-left transition-all duration-200 flex items-center justify-between ${
                        isBlogsResourcesActive
                          ? "text-white bg-white/10"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>Blogs & Resources</span>
                      <span aria-hidden="true" className="text-xs">
                        {mobileDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {mobileDropdownOpen && (
                      <div role="menu" aria-label="Blogs and resources mobile menu" className="mt-1 ml-3 space-y-1">
                        <Link
                          to="/blogs"
                          role="menuitem"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isBlogsActive
                              ? "text-white bg-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Blogs
                        </Link>
                        <Link
                          to="/resources"
                          role="menuitem"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            isResourcesActive
                              ? "text-white bg-white/10"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          Resources
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10">
                    <Link
                      to="/contact#start"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 rounded-lg text-base font-semibold text-center text-[#0A1628]"
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

  // Desktop: Bottom navigation bar
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
        className="pointer-events-auto px-6 py-3 rounded-full"
        style={{
          background: "rgba(10,22,40,0.9)",
          backdropFilter: "blur(8px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive(link.href)
                  ? "text-white"
                  : "text-white/60 hover:text-white/90"
                }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
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
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center gap-2 ${
                isBlogsResourcesActive
                  ? "text-white"
                  : "text-white/60 hover:text-white/90"
              }`}
            >
              Blogs & Resources
              <span aria-hidden="true" className="text-[10px]">
                {desktopDropdownOpen ? "▲" : "▼"}
              </span>
              {isBlogsResourcesActive && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
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
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-[#0f1623] border border-yellow-400/20 rounded-xl p-2 min-w-[160px] shadow-[0_16px_36px_rgba(0,0,0,0.45)]"
              >
                <div className="space-y-1">
                  <Link
                    to="/blogs"
                    role="menuitem"
                    className={`block px-4 py-2 text-sm text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors ${
                      isBlogsActive
                        ? "text-yellow-400 bg-white/5"
                        : ""
                    }`}
                  >
                    Blogs
                  </Link>
                  <Link
                    to="/resources"
                    role="menuitem"
                    className={`block px-4 py-2 text-sm text-white hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors ${
                      isResourcesActive
                        ? "text-yellow-400 bg-white/5"
                        : ""
                    }`}
                  >
                    Resources
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-white/10" />

          <Link
            to="/contact#start"
            className="px-5 py-2 rounded-full text-sm font-semibold inline-flex items-center justify-center"
            style={{
              background: "#ffd51e",
              color: "#0A1628",
              boxShadow: "0 2px 8px rgba(255,213,30,0.3)",
              transition: "transform 120ms cubic-bezier(0.25, 0.1, 0.25, 1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-1px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
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
