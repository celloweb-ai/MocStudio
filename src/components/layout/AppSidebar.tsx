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
  ChevronsLeft,
  ChevronsRight,
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
          "hover:bg-sidebar-accent group relative overflow-hidden",
          isActive
            ? "bg-primary/10 text-primary border-l-2 border-primary shadow-sm"
            : "text-sidebar-foreground hover:text-sidebar-accent-foreground",
          compact ? "justify-center" : "",
        )}
      >
        {/* Active indicator animation */}
        {isActive && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        )}
        
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-all duration-200",
            isActive ? "text-primary scale-110" : "text-sidebar-foreground group-hover:text-primary group-hover:scale-105",
            "relative z-10"
          )}
        />
        {!compact && (
          <span className="text-sm font-medium truncate relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">
            {t(item.name)}
          </span>
        )}
      </NavLink>
    );

    if (compact) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="bg-popover border-border shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-left-2"
            sideOffset={8}
          >
            <span className="font-medium">{t(item.name)}</span>
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  const SidebarContent = ({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) => (
    <>
      {/* Header with logo and title */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          compact ? "justify-center w-full" : ""
        )}>
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-primary/10 ring-2 ring-primary/20 transition-transform duration-200 hover:scale-110">
            <img src={logoImg} alt="MOC Studio" className="w-6 h-6 object-contain" />
          </div>
          {!compact && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="font-bold text-foreground text-base tracking-tight">MOC Studio</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {t("sidebar.managementOfChange")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <div
              key={item.href}
              className="animate-in fade-in slide-in-from-left-1 duration-200"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <NavItem item={item} compact={compact} onNavigate={onNavigate} />
            </div>
          ))}
        </div>

        {/* Admin section */}
        <div className="pt-4 mt-4 border-t border-sidebar-border">
          {!compact && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              {t("nav.administration")}
            </span>
          )}
          <div className="space-y-1">
            {adminItems.map((item, index) => (
              <div
                key={item.href}
                className="animate-in fade-in slide-in-from-left-1 duration-200"
                style={{ animationDelay: `${(navigationItems.length + index) * 30}ms` }}
              >
                <NavItem item={item} compact={compact} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer with controls */}
      <div className="p-3 border-t border-sidebar-border bg-sidebar/50 backdrop-blur-sm space-y-1">
        {/* Language toggle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={cn(
                "w-full transition-all duration-200 hover:bg-sidebar-accent",
                compact ? "justify-center px-2" : "justify-start px-3"
              )}
            >
              <Globe className="h-4 w-4 transition-transform hover:rotate-12" />
              {!compact && (
                <span className="text-xs ml-2 font-medium">
                  {language === "en" ? "Português" : "English"}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          {compact && (
            <TooltipContent side="right" sideOffset={8}>
              {language === "en" ? "Switch to Português" : "Switch to English"}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                "w-full transition-all duration-200 hover:bg-sidebar-accent",
                compact ? "justify-center px-2" : "justify-start px-3"
              )}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4 transition-transform hover:rotate-90" />
                  {!compact && <span className="text-xs ml-2 font-medium">{t("sidebar.lightMode")}</span>}
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
                  {!compact && <span className="text-xs ml-2 font-medium">{t("sidebar.darkMode")}</span>}
                </>
              )}
            </Button>
          </TooltipTrigger>
          {compact && (
            <TooltipContent side="right" sideOffset={8}>
              {theme === "dark" ? t("sidebar.lightMode") : t("sidebar.darkMode")}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Collapse/Expand toggle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className={cn(
                "w-full transition-all duration-200 hover:bg-sidebar-accent group",
                compact ? "justify-center px-2" : "justify-start px-3"
              )}
            >
              {collapsed ? (
                <>
                  <ChevronsRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  {!compact && <span className="text-xs ml-2 font-medium">{t("sidebar.expand")}</span>}
                </>
              ) : (
                <>
                  <ChevronsLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  {!compact && <span className="text-xs ml-2 font-medium">{t("sidebar.collapse")}</span>}
                </>
              )}
            </Button>
          </TooltipTrigger>
          {compact && (
            <TooltipContent side="right" sideOffset={8}>
              {collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border hidden md:flex",
          "flex-col z-50 shadow-lg",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <SidebarContent compact={collapsed} />
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent 
          side="left" 
          className="w-64 p-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden [&>button]:hidden"
        >
          <div className="h-full flex flex-col">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
