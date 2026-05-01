"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { LabAdminThemeProvider } from "@/components/admin/LabAdminThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LabAdminThemeProvider>{children}</LabAdminThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
