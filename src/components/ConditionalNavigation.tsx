"use client";

import { usePathname } from "next/navigation";
import AdminNavigation from "@/components/AdminNavigation";
import Navigation from "@/components/ui/navigation";

const NAV_VISIBLE_PATHS = new Set([
  "/",
  "/about",
  "/services",
  "/contact",
  "/privacy-policy",
  "/blogs",
  "/resources",
  "/new",
]);

export default function ConditionalNavigation() {
  const pathname = usePathname() ?? "/";
  const isAdminRoute = pathname.startsWith("/labadmin");
  const isAdminLoginRoute = pathname === "/labadmin/login";
  const isKnownFrontendRoute =
    NAV_VISIBLE_PATHS.has(pathname) ||
    pathname.startsWith("/blogs/") ||
    pathname.startsWith("/resources/");

  const isAgreementPage = /^\/[a-z0-9-]{8,}$/i.test(pathname) && !isKnownFrontendRoute;

  if (isAdminLoginRoute) return null;
  if (isAdminRoute) return <AdminNavigation />;
  if (isAgreementPage) return null;
  return <Navigation />;
}
