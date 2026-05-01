"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type LabAdminTheme = "dark" | "light";

type LabAdminThemeContextValue = {
  theme: LabAdminTheme;
  toggleTheme: () => void;
};

const STORAGE_KEY = "labadmin-theme";
const LabAdminThemeContext = createContext<LabAdminThemeContextValue | null>(null);

export function LabAdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<LabAdminTheme>("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      setIsHydrated(true);
      return;
    }

    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isHydrated, theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
      },
    }),
    [theme],
  );

  return (
    <LabAdminThemeContext.Provider value={value}>
      <div className="labadmin-shell" data-theme={theme} suppressHydrationWarning>
        {children}
      </div>
    </LabAdminThemeContext.Provider>
  );
}

export function useLabAdminTheme() {
  const value = useContext(LabAdminThemeContext);
  if (!value) {
    throw new Error("useLabAdminTheme must be used within LabAdminThemeProvider");
  }
  return value;
}
