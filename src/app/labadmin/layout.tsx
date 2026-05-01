import type { Metadata } from "next";
import "./labadmin-theme.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function LabAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
