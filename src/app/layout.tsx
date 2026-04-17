import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
