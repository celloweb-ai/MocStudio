import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { SidebarProvider, useSidebarContext } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutInner({ children }: AppLayoutProps) {
  const { collapsed } = useSidebarContext();
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className={cn("transition-all duration-300", collapsed ? "pl-16" : "pl-64")}>
        <TopBar />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </SidebarProvider>
  );
}
