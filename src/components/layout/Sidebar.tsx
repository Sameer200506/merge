"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Map,
  Users2,
  Activity,
  Settings,
  Zap,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    icon: Building2,
    children: [
      { label: "Contacts", href: "/crm/contacts", icon: Users },
      { label: "Companies", href: "/crm/companies", icon: Building2 },
      { label: "Deals", href: "/crm/deals", icon: TrendingUp },
    ],
  },
  {
    label: "Work",
    icon: FolderKanban,
    children: [
      { label: "Projects", href: "/work/projects", icon: FolderKanban },
      { label: "Tasks", href: "/work/tasks", icon: CheckSquare },
      { label: "Roadmaps", href: "/work/roadmaps", icon: Map },
    ],
  },
  {
    label: "Team",
    href: "/team",
    icon: Users2,
  },
  {
    label: "Activity",
    href: "/activity",
    icon: Activity,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Customers: true,
    Work: true,
  });

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function toggleGroup(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
        >
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold leading-none" style={{ color: "var(--text-primary)" }}>StartupOS</span>
          <span className="text-[10px] leading-none mt-0.5" style={{ color: "var(--text-muted)" }}>Demo Workspace</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.href ? (
                // Single item
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all"
                  style={{
                    color: isActive(item.href) ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive(item.href) ? "var(--bg-active)" : "transparent",
                    fontWeight: isActive(item.href) ? 500 : 400,
                  }}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: isActive(item.href) ? "var(--accent)" : "inherit" }} />
                  {item.label}
                </Link>
              ) : (
                // Group
                <div>
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all hover:bg-[var(--bg-hover)]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{item.label}</span>
                    {expanded[item.label] ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                  {expanded[item.label] && (
                    <ul className="mt-0.5 ml-2 space-y-0.5">
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all"
                            style={{
                              color: isActive(child.href) ? "var(--text-primary)" : "var(--text-secondary)",
                              background: isActive(child.href) ? "var(--bg-active)" : "transparent",
                              fontWeight: isActive(child.href) ? 500 : 400,
                            }}
                          >
                            <child.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isActive(child.href) ? "var(--accent)" : "inherit" }} />
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings + User */}
      <div className="px-2 pb-3 space-y-0.5" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all"
          style={{
            color: isActive("/settings") ? "var(--text-primary)" : "var(--text-secondary)",
            background: isActive("/settings") ? "var(--bg-active)" : "transparent",
          }}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
