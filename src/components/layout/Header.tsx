"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Command as CmdIcon,
  X,
  TrendingUp,
  FolderKanban,
  Users,
  Building2,
} from "lucide-react";
import { getInitials, formatRelativeTime } from "@/lib/utils/format";
import type { Notification } from "@/types";

type SearchResult = {
  contacts: { id: string; name: { firstName: string; lastName: string }; email: string }[];
  companies: { id: string; name: { text: string }; domainName?: { primaryLinkUrl: string } }[];
  deals: { id: string; name: string; stage: string }[];
  projects: { id: string; name: string; status: string }[];
};

export default function Header({ user }: { user: { name?: string | null; email?: string | null; id?: string } }) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    fetch("/api/notifications").then((r) => r.json()).then(setNotifications).catch(() => {});
  }, []);

  // Search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function navigate(href: string) {
    router.push(href);
    setSearchOpen(false);
    setQuery("");
    setResults(null);
  }

  return (
    <>
      <header
        className="flex items-center gap-3 px-4 h-14 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)" }}
      >
        {/* Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 flex-1 max-w-sm px-3 py-1.5 rounded-lg text-sm transition-all"
          style={{
            background: "var(--bg-overlay)",
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="text-xs px-1 rounded" style={{ background: "var(--bg-active)", color: "var(--text-muted)" }}>⌘K</kbd>
          </div>
        </button>

        <div className="flex items-center gap-1 ml-auto">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notif dropdown */}
            {notifOpen && (
              <div
                className="absolute right-0 top-10 w-80 rounded-xl shadow-2xl z-50 animate-fade-in"
                style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Notifications</span>
                  <button className="text-xs" style={{ color: "var(--accent)" }}>Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 transition-all cursor-pointer"
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        background: n.read ? "transparent" : "var(--accent-muted)",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = n.read ? "transparent" : "var(--accent-muted)")}
                    >
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--accent)" }} />
                      )}
                      <div className={n.read ? "" : ""} style={{ marginLeft: n.read ? "18px" : undefined }}>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{n.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{n.body}</p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}
            >
              {getInitials(user?.name || "U")}
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 top-10 w-52 rounded-xl shadow-2xl z-50 py-1 animate-fade-in"
                style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}
              >
                <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                </div>
                <button
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <User className="w-3.5 h-3.5" /> Profile
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <Settings className="w-3.5 h-3.5" /> Settings
                </button>
                <div style={{ borderTop: "1px solid var(--border)", marginTop: "4px", paddingTop: "4px" }}>
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-all"
                    style={{ color: "var(--danger)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--danger-muted)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div
            className="w-full max-w-lg mx-4 rounded-xl shadow-2xl overflow-hidden animate-fade-in"
            style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}
          >
            {/* Input */}
            <div className="flex items-center gap-2 px-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 py-3.5 text-sm bg-transparent outline-none"
                style={{ color: "var(--text-primary)" }}
                placeholder="Search contacts, deals, projects..."
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults(null); }}>
                  <X className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                </button>
              )}
              <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--bg-active)", color: "var(--text-muted)" }}>Esc</kbd>
            </div>

            {/* Results */}
            {results ? (
              <div className="max-h-80 overflow-y-auto">
                {["contacts", "companies", "deals", "projects"].map((type) => {
                  const items = results[type as keyof SearchResult];
                  if (!items?.length) return null;
                  const icons: Record<string, React.ElementType> = { contacts: Users, companies: Building2, deals: TrendingUp, projects: FolderKanban };
                  const Icon = icons[type];
                  return (
                    <div key={type}>
                      <div className="px-4 pt-3 pb-1">
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{type}</span>
                      </div>
                      {items.map((item: { id: string; name: { firstName?: string; lastName?: string; text?: string } | string; email?: string }) => {
                        const label = typeof item.name === "string" ? item.name : item.name?.text || `${item.name?.firstName} ${item.name?.lastName}`;
                        const href = type === "contacts" ? `/crm/contacts` : type === "companies" ? `/crm/companies` : type === "deals" ? `/crm/deals` : `/work/projects`;
                        return (
                          <button
                            key={item.id}
                            onClick={() => navigate(href)}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-all"
                            style={{ color: "var(--text-primary)" }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                            <span>{label}</span>
                            {(item as { email?: string }).email && <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{(item as { email?: string }).email}</span>}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                {query.length < 2 ? (
                  <>
                    <CmdIcon className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>Type to search across your workspace</p>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No results for &quot;{query}&quot;</p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2" style={{ borderTop: "1px solid var(--border)" }}>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}><kbd style={{ color: "var(--text-muted)" }}>↑↓</kbd> navigate</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}><kbd>↵</kbd> open</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}><kbd>Esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
