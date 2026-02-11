import { NavLink, useLocation } from "react-router-dom";
import logoImg from "@/assets/logo.png";
import {
  LayoutDashboard,
  Building2,
  Cog,
  FileText,
  AlertTriangle,
  ClipboardList,
  Link2,
  Users,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/contexts/SidebarContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Facilities", href: "/facilities", icon: Building2 },
  { name: "Assets", href: "/assets", icon: Cog },
  { name: "MOC Requests", href: "/moc-requests", icon: FileText },
  { name: "Risk Analysis", href: "/risk-analysis", icon: AlertTriangle },
  { name: "Work Orders", href: "/work-orders", icon: ClipboardList },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Standards & Links", href: "/standards", icon: Link2 },
];

const adminItems = [
  { name: "User Management", href: "/admin/users", icon: Users },
];

export function AppSidebar() {
  const { collapsed, toggle } = useSidebarContext();
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    const linkContent = (
      <NavLink
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-sidebar-accent group",
          isActive
            ? "bg-primary/10 text-primary border-l-2 border-primary"
            : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary"
          )}
        />
        {!collapsed && (
          <span className="text-sm font-medium truncate">{item.name}</span>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="bg-popover border-border">
            {item.name}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border",
        "flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={logoImg} alt="MOC Studio" className="w-8 h-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground">MOC Studio</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Management of Change
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        {/* Admin Section */}
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          {!collapsed && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </span>
          )}
          <div className="mt-2 space-y-1">
            {adminItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
