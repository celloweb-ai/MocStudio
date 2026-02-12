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
  isAnimating: boolean;
}

const SIDEBAR_STORAGE_KEY = "app:sidebar:collapsed";
const ANIMATION_DURATION = 300; // milliseconds

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (storedState !== null) {
      setCollapsed(storedState === "true");
    }
  }, []);

  // Persist collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  // Handle animation state
  const handleToggle = (toggleFn: () => void) => {
    setIsAnimating(true);
    toggleFn();
    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
  };

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed: (v: boolean) => {
        if (v !== collapsed) {
          handleToggle(() => setCollapsed(v));
        }
      },
      toggleCollapse: () => handleToggle(() => setCollapsed((current) => !current)),
      mobileOpen,
      setMobileOpen,
      toggleMobile: () => setMobileOpen((current) => !current),
      toggle: () => {
        if (isMobile) {
          setMobileOpen((current) => !current);
        } else {
          handleToggle(() => setCollapsed((current) => !current));
        }
      },
      isAnimating,
    }),
    [collapsed, isMobile, mobileOpen, isAnimating],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebarContext must be used within SidebarProvider");
  return ctx;
}
