"use client";

import { mockTasks } from "@/lib/mock-data";
import { mockProjects } from "@/lib/mock-data";
import { formatDate, getInitials, priorityLabel } from "@/lib/utils/format";
import Link from "next/link";

const priorityColors: Record<string, string> = { urgent: "#ef4444", high: "#f97316", medium: "#f59e0b", low: "#3b82f6" };

export default function AllTasksPage() {
  const allTasks = Object.values(mockTasks).flat();
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>All Tasks</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{allTasks.length} tasks across all projects</p>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead><tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Task","Project","Priority","Assignee","Due Date","Status"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {allTasks.map(t => {
              const project = mockProjects.find(p => p.id === t.projectId);
              return (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{t.name}</td>
                  <td className="px-4 py-3">
                    {project && <Link href={`/work/projects/${project.id}`} className="text-xs hover:underline" style={{ color: "var(--accent)" }}>{project.name}</Link>}
                  </td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: priorityColors[t.priority]+"20", color: priorityColors[t.priority] }}>{priorityLabel(t.priority)}</span></td>
                  <td className="px-4 py-3">
                    {t.assignees?.[0] && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>{getInitials(t.assignees[0].displayName)}</div>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.assignees[0].displayName}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{t.dueDate ? formatDate(t.dueDate) : "—"}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ background: t.state.color }} /><span className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.state.name}</span></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
