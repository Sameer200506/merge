import { mockProjects } from "@/lib/mock-data";
import { formatDate, projectStatusLabel } from "@/lib/utils/format";
import Link from "next/link";

const statusColors: Record<string, string> = { backlog: "#6366f1", started: "#22c55e", paused: "#f59e0b", completed: "#3b82f6", cancelled: "#52525b" };

export default function RoadmapsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Roadmaps</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Project timelines and milestones</p>
      </div>
      <div className="space-y-4">
        {mockProjects.map(p => {
          const pct = p.totalIssues > 0 ? Math.round((p.completedIssues / p.totalIssues) * 100) : 0;
          const start = p.startDate ? new Date(p.startDate) : null;
          const end = p.targetDate ? new Date(p.targetDate) : null;
          const today = new Date();
          let timeProgress = 0;
          if (start && end) {
            const total = end.getTime() - start.getTime();
            const elapsed = today.getTime() - start.getTime();
            timeProgress = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));
          }
          return (
            <div key={p.id} className="rounded-xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColors[p.status]+"20", color: statusColors[p.status] }}>{projectStatusLabel(p.status)}</span>
                    {p.client && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.client}</span>}
                  </div>
                  <Link href={`/work/projects/${p.id}`}><h3 className="text-sm font-semibold hover:underline" style={{ color: "var(--text-primary)" }}>{p.name}</h3></Link>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{pct}% complete</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{p.completedIssues}/{p.totalIssues} tasks</p>
                </div>
              </div>
              {/* Timeline bar */}
              <div className="relative">
                <div className="h-6 rounded-lg overflow-hidden" style={{ background: "var(--bg-overlay)" }}>
                  <div className="h-full rounded-lg opacity-30" style={{ width: `${pct}%`, background: statusColors[p.status] }} />
                  {/* Time marker */}
                  <div className="absolute top-0 bottom-0 w-0.5" style={{ left: `${timeProgress}%`, background: "var(--text-muted)", opacity: 0.5 }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{start ? formatDate(p.startDate!) : "—"}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{end ? formatDate(p.targetDate!) : "—"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
