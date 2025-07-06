import { useState, useMemo } from "react";
import { Link, useLocation } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "~/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip";
import {
  LayoutDashboard,
  Recycle,
  Users,
  TrendingUp,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  MessageCircle,
  MapPin,
  Package,
  DollarSign,
  UserCheck,
  Building2,
  Newspaper,
  HelpCircle,
  Bell,
  Shield,
  ChevronDown,
  X,
  Truck,
  Calendar,
  ClipboardList,
  Target,
  Timer,
  AlertCircle,
  CheckCircle,
  Route,
  Phone,
  Search
} from "lucide-react";
import { cn } from "~/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
  isMobile: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface MenuItem {
  title: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string;
  badgeVariant?: "pro" | "new" | "urgent";
  children?: MenuItem[];
}

const operationalMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    children: [
      {
        title: "Overview Harian",
        href: "/pengelola/dashboard"
      },
      {
        title: "Monitoring Real-time",
        href: "/pengelola/dashboard/monitoring",
        badge: "new"
      },
      { title: "Target vs Pencapaian", href: "/pengelola/dashboard/targets" },
      { title: "Jadwal Hari Ini", href: "/pengelola/dashboard/schedule" }
    ]
  },
  {
    title: "Operasional Sampah",
    icon: <Recycle className="w-5 h-5" />,
    children: [
      {
        title: "Pengumpulan Harian",
        href: "/pengelola/dashboard/collection",
        badge: "urgent"
      },
      { title: "Sortir & Klasifikasi", href: "/pengelola/dashboard/sorting" },
      { title: "Stok Sampah", href: "/pengelola/dashboard/inventory" },
      { title: "Kualitas Check", href: "/pengelola/dashboard/quality" },
      {
        title: "Input Data Berat",
        href: "/pengelola/dashboard/weight-input",
        badge: "new"
      }
    ]
  },
  {
    title: "Explore",
    icon: <Search className="w-5 h-5" />,
    href: "/pengelola/dashboard/explorewaste"
  },
  {
    title: "Manajemen Pengepul",
    icon: <Users className="w-5 h-5" />,
    children: [
      { title: "Daftar Pengepul Aktif", href: "/pengelola/collectors/active" },
      { title: "Jadwal Pickup", href: "/pengelola/collectors/schedule" },
      { title: "Performa Pengepul", href: "/pengelola/collectors/performance" },
      {
        title: "Pengepul Pending",
        href: "/pengelola/collectors/pending",
        badge: "urgent"
      },
      { title: "Rating & Feedback", href: "/pengelola/collectors/feedback" }
    ]
  },
  {
    title: "Transaksi & Pembayaran",
    icon: <CreditCard className="w-5 h-5" />,
    children: [
      { title: "Transaksi Hari Ini", href: "/pengelola/transactions/today" },
      {
        title: "Pembayaran Tertunda",
        href: "/pengelola/transactions/pending",
        badge: "urgent"
      },
      {
        title: "Verifikasi Pembayaran",
        href: "/pengelola/transactions/verification"
      },
      { title: "Riwayat Transaksi", href: "/pengelola/transactions/history" },
      { title: "Rekap Harian", href: "/pengelola/transactions/daily-recap" }
    ]
  }
];

const fieldMenuItems: MenuItem[] = [
  {
    title: "Area Coverage",
    icon: <MapPin className="w-5 h-5" />,
    children: [
      { title: "Peta Operasional", href: "/pengelola/coverage/map" },
      { title: "Rute Pengumpulan", href: "/pengelola/coverage/routes" },
      {
        title: "Titik Pengumpulan",
        href: "/pengelola/coverage/collection-points"
      },
      {
        title: "Area Prioritas",
        href: "/pengelola/coverage/priority-areas",
        badge: "new"
      }
    ]
  },
  {
    title: "Penjadwalan",
    icon: <Calendar className="w-5 h-5" />,
    children: [
      { title: "Jadwal Mingguan", href: "/pengelola/schedule/weekly" },
      { title: "Pengepul On-duty", href: "/pengelola/schedule/on-duty" },
      { title: "Shift Management", href: "/pengelola/schedule/shifts" },
      {
        title: "Emergency Pickup",
        href: "/pengelola/schedule/emergency",
        badge: "urgent"
      }
    ]
  },
  {
    title: "Komunikasi",
    icon: <MessageCircle className="w-5 h-5" />,
    children: [
      { title: "Chat Pengepul", href: "/pengelola/dashboard/chat" },
      {
        title: "Broadcast Message",
        href: "/pengelola/dashboard/broadcast"
      },
      {
        title: "Notifikasi Operasional",
        href: "/pengelola/dashboard/notifications"
      },
      {
        title: "Support Ticket",
        href: "/pengelola/dashboard/support",
        badge: "urgent"
      }
    ]
  },
  {
    title: "Task Management",
    icon: <ClipboardList className="w-5 h-5" />,
    children: [
      { title: "Task Harian", href: "/pengelola/tasks/daily", badge: "urgent" },
      { title: "Checklist Operasi", href: "/pengelola/tasks/checklist" },
      { title: "Follow-up Required", href: "/pengelola/tasks/followup" },
      { title: "Completed Tasks", href: "/pengelola/tasks/completed" }
    ]
  }
];

const reportingMenuItems: MenuItem[] = [
  {
    title: "Laporan Operasional",
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { title: "Laporan Harian", href: "/pengelola/reports/daily" },
      { title: "Laporan Mingguan", href: "/pengelola/reports/weekly" },
      { title: "Performa Tim", href: "/pengelola/reports/team-performance" },
      { title: "Analisis Trend", href: "/pengelola/reports/trends" }
    ]
  },
  {
    title: "Monitoring Kinerja",
    icon: <TrendingUp className="w-5 h-5" />,
    children: [
      { title: "KPI Dashboard", href: "/pengelola/kpi/dashboard" },
      { title: "Target Achievement", href: "/pengelola/kpi/targets" },
      { title: "Efficiency Metrics", href: "/pengelola/kpi/efficiency" },
      { title: "Quality Metrics", href: "/pengelola/kpi/quality" }
    ]
  },
  {
    title: "Alerts & Issues",
    icon: <AlertCircle className="w-5 h-5" />,
    children: [
      {
        title: "Alert Aktif",
        href: "/pengelola/alerts/active",
        badge: "urgent"
      },
      { title: "Issue Tracking", href: "/pengelola/alerts/issues" },
      { title: "Maintenance Schedule", href: "/pengelola/alerts/maintenance" },
      { title: "Escalation Log", href: "/pengelola/alerts/escalation" }
    ]
  },
  {
    title: "Pengaturan",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { title: "Profil Pengelola", href: "/pengelola/settings/profile" },
      {
        title: "Notifikasi Setting",
        href: "/pengelola/settings/notifications"
      },
      { title: "Area Tanggung Jawab", href: "/pengelola/settings/area" },
      { title: "Tim & Koordinator", href: "/pengelola/settings/team" }
    ]
  }
];

function MenuSection({
  title,
  items,
  isCollapsed,
  isHovered
}: {
  title: string;
  items: MenuItem[];
  isCollapsed: boolean;
  isHovered: boolean;
}) {
  const showText = !isCollapsed || isHovered;

  return (
    <div className="space-y-2">
      {showText && (
        <h3 className="mb-4 px-3 text-xs uppercase text-gray-500 dark:text-gray-300 font-semibold tracking-wider">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
        ))}
      </ul>
    </div>
  );
}

function MenuItemComponent({
  item,
  isCollapsed,
  isHovered
}: {
  item: MenuItem;
  isCollapsed: boolean;
  isHovered: boolean;
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const showText = !isCollapsed || isHovered;

  // Check if any child is active
  const isChildActive = useMemo(() => {
    if (!hasChildren) return false;
    return item.children!.some((child) => child.href === pathname);
  }, [hasChildren, item.children, pathname]);

  // Auto open if child is active
  useMemo(() => {
    if (isChildActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isChildActive, isOpen]);

  // For collapsed state without hover, show tooltip
  if (isCollapsed && !isHovered) {
    return (
      <li>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-12 p-0 justify-center transition-colors",
                  isChildActive && "bg-blue-100 dark:bg-blue-900/30"
                )}
                asChild={!hasChildren}
              >
                {hasChildren ? (
                  <div
                    className={cn(
                      "text-gray-700 dark:text-gray-100",
                      isChildActive && "text-blue-700 dark:text-blue-400"
                    )}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <Link to={item.href || "#"}>
                    <div
                      className={cn(
                        "text-gray-700 dark:text-gray-100",
                        pathname === item.href &&
                          "text-blue-700 dark:text-blue-400"
                      )}
                    >
                      {item.icon}
                    </div>
                  </Link>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    );
  }

  if (hasChildren) {
    return (
      <li>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between px-3 py-2.5 h-auto transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                isChildActive &&
                  "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "transition-colors",
                    isChildActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-100"
                  )}
                >
                  {item.icon}
                </span>
                {showText && (
                  <span
                    className={cn(
                      "text-sm font-medium text-gray-900 dark:text-gray-100",
                      isChildActive && "text-blue-700 dark:text-blue-400"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </div>
              {showText && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180",
                    isChildActive && "text-blue-600 dark:text-blue-400"
                  )}
                />
              )}
            </Button>
          </CollapsibleTrigger>
          {showText && (
            <CollapsibleContent className="ml-8 mt-1 space-y-1">
              {item.children?.map((child, childIndex) => {
                const isActive = pathname === child.href;
                return (
                  <Link
                    key={childIndex}
                    to={child.href || "#"}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-700",
                      isActive
                        ? "bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        : "text-gray-600 dark:text-gray-200"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && (
                        <div className="w-1 h-4 bg-blue-600 rounded-full" />
                      )}
                      {child.title}
                    </span>
                    {child.badge && (
                      <Badge
                        variant={
                          child.badge === "urgent"
                            ? "destructive"
                            : child.badge === "pro"
                            ? "secondary"
                            : "default"
                        }
                        className={cn(
                          "text-xs",
                          child.badge === "urgent" &&
                            "bg-red-100 text-red-700 hover:bg-red-200",
                          child.badge === "new" &&
                            "bg-green-100 text-green-700 hover:bg-green-200"
                        )}
                      >
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </CollapsibleContent>
          )}
        </Collapsible>
      </li>
    );
  }

  // Single menu item (no children)
  const isActive = pathname === item.href;

  return (
    <li>
      <Button
        asChild
        variant="ghost"
        className={cn(
          "w-full justify-start px-3 py-2.5 h-auto transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          isActive &&
            "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:hover:bg-blue-900/50"
        )}
      >
        <Link to={item.href || "#"}>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-100"
              )}
            >
              {item.icon}
            </span>
            {showText && (
              <span
                className={cn(
                  "text-sm font-medium text-gray-900 dark:text-gray-100",
                  isActive && "text-blue-700 dark:text-blue-400"
                )}
              >
                {item.title}
              </span>
            )}
          </div>
        </Link>
      </Button>
    </li>
  );
}

export function PengelolaSidebar({
  isOpen,
  isCollapsed,
  isHovered,
  isMobile,
  onClose,
  onMouseEnter,
  onMouseLeave
}: SidebarProps) {
  const sidebarWidth = isCollapsed && !isHovered ? "w-20" : "w-72";
  const showText = !isCollapsed || isHovered;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800",
        "border-r border-gray-200 dark:border-gray-700",
        "transition-all duration-300 ease-in-out",
        isMobile
          ? cn("w-72", isOpen ? "translate-x-0" : "-translate-x-full")
          : cn(sidebarWidth, "translate-x-0")
      )}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {showText && (
          <Link to="/pengelola/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              ♻️
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              RIjig Pengelola
            </div>
          </Link>
        )}

        {!showText && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto">
            ♻️
          </div>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 h-[calc(100vh-64px)]">
        <div className="py-6 px-3 space-y-6">
          <MenuSection
            title="Operasional Harian"
            items={operationalMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
          <MenuSection
            title="Field Operations"
            items={fieldMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
          <MenuSection
            title="Reporting & Settings"
            items={reportingMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
        </div>

        {/* Footer CTA - Only show when not collapsed or when hovered */}
        {showText && (
          <div className="p-4 mx-3 mb-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                Pengelola Dashboard
              </h4>
            </div>
            <p className="mb-4 text-blue-700 dark:text-blue-200 text-xs">
              Kelola operasional harian pengumpulan dan pengolahan sampah secara
              efisien.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                Emergency Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-900/20"
              >
                Quick Report
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
