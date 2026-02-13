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
    <div className="app-shell min-h-screen bg-background">
      <AppSidebar />
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          "pl-0 md:pl-16",
          !collapsed && "md:pl-64"
        )}
      >
        <TopBar />
        <main className="relative z-10 p-6 animate-fade-in">
          <div className="transition-all duration-200">
            {children}
          </div>
        </main>
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
