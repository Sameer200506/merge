"use client";

import { mockActivities } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils/format";

const actionIcons: Record<string, string> = { won: "🏆", created: "✨", updated: "📝", completed: "✅", assigned: "👤" };
const sourceColors: Record<string, string> = { crm: "#6366f1", project: "#22c55e", system: "#52525b" };

export default function ActivityPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Activity Feed</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Recent actions across your workspace</p>
      </div>
      <div className="space-y-1">
        {mockActivities.map((a, i) => {
          const targetName = a.metadata.dealName || a.metadata.projectName || a.metadata.taskName || a.metadata.contactName || a.entityId;
          return (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl transition-colors" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: "var(--bg-overlay)" }}>
                {actionIcons[a.action] || "📌"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  <span className="font-semibold">{a.actor}</span>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{a.action}</span>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>{a.entityType}</span>{" "}
                  <span className="font-medium">&quot;{targetName}&quot;</span>
                </p>
                {a.metadata.amount && (
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">Value: {a.metadata.amount}</p>
                )}
                {a.metadata.status && (
                  <p className="text-xs text-zinc-400 mt-0.5">Status: {a.metadata.status}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: (sourceColors[a.source] || "#52525b") + "20", color: sourceColors[a.source] || "#52525b" }}>{a.source}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatRelativeTime(a.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
