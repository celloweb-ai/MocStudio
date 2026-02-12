import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapse: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  toggleMobile: () => void;
  toggle: () => void;
}

const SIDEBAR_STORAGE_KEY = "app:sidebar:collapsed";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (storedState !== null) {
      setCollapsed(storedState === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapse: () => setCollapsed((current) => !current),
      mobileOpen,
      setMobileOpen,
      toggleMobile: () => setMobileOpen((current) => !current),
      toggle: () => (isMobile ? setMobileOpen((current) => !current) : setCollapsed((current) => !current)),
    }),
    [collapsed, isMobile, mobileOpen],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebarContext must be used within SidebarProvider");
  return ctx;
}
