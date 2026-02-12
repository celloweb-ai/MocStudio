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
  CircleHelp,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { TranslationKey } from "@/i18n/translations";

const navigationItems: { name: TranslationKey; href: string; icon: typeof LayoutDashboard }[] = [
  { name: "nav.dashboard", href: "/", icon: LayoutDashboard },
  { name: "nav.facilities", href: "/facilities", icon: Building2 },
  { name: "nav.assets", href: "/assets", icon: Cog },
  { name: "nav.mocRequests", href: "/moc-requests", icon: FileText },
  { name: "nav.riskAnalysis", href: "/risk-analysis", icon: AlertTriangle },
  { name: "nav.workOrders", href: "/work-orders", icon: ClipboardList },
  { name: "nav.reports", href: "/reports", icon: BarChart3 },
  { name: "nav.standards", href: "/standards", icon: Link2 },
  { name: "nav.helpCenter", href: "/help-center", icon: CircleHelp },
];

const adminItems: { name: TranslationKey; href: string; icon: typeof Users }[] = [
  { name: "nav.userManagement", href: "/admin/users", icon: Users },
];

export function AppSidebar() {
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapse } = useSidebarContext();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const NavItem = ({ item, compact, onNavigate }: { item: typeof navigationItems[0]; compact?: boolean; onNavigate?: () => void }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    const linkContent = (
      <NavLink
        to={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-sidebar-accent group",
          isActive
            ? "bg-primary/10 text-primary border-l-2 border-primary"
            : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-primary",
          )}
        />
        {!compact && <span className="text-sm font-medium truncate">{t(item.name)}</span>}
      </NavLink>
    );

    if (compact) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" className="bg-popover border-border">
            {t(item.name)}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  const SidebarContent = ({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) => (
    <>
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={logoImg} alt="MOC Studio" className="w-8 h-8 object-contain" />
          </div>
          {!compact && (
            <div className="flex flex-col">
              <span className="font-bold text-foreground">MOC Studio</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("sidebar.managementOfChange")}</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.href} item={item} compact={compact} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          {!compact && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("nav.administration")}</span>
          )}
          <div className="mt-2 space-y-1">
            {adminItems.map((item) => (
              <NavItem key={item.href} item={item} compact={compact} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          {!compact && <span className="text-xs ml-2">{language === "en" ? "Português" : "English"}</span>}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4" />
              {!compact && <span className="text-xs ml-2">{t("sidebar.lightMode")}</span>}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              {!compact && <span className="text-xs ml-2">{t("sidebar.darkMode")}</span>}
            </>
          )}
        </Button>

        {!compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="w-full justify-center text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span className="text-xs">{t("sidebar.collapse")}</span>
          </Button>
        )}

        {compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="w-full justify-center text-muted-foreground hover:text-foreground"
            title={t("sidebar.collapse")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border hidden md:flex",
          "flex-col transition-[width] duration-300 z-50",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent compact={collapsed} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden [&>button]:hidden">
          <div className="h-full flex flex-col">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
