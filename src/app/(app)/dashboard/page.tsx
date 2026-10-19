import { TrendingUp, DollarSign, Trophy, FolderKanban } from "lucide-react";
import { mockDeals, mockProjects, mockTasks, mockActivities } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, dealStageLabel } from "@/lib/utils/format";

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
          <p className="text-2xl font-semibold mt-2" style={{ color: "var(--text-primary)" }}>{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color + "20" }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Stats from mock data
  const leads = mockDeals.filter((d) => d.stage === "LEAD").length;
  const activeDeals = mockDeals.filter((d) => !['WON','LOST'].includes(d.stage)).length;
  const wonDeals = mockDeals.filter((d) => d.stage === "WON");
  const revenue = wonDeals.reduce((sum, d) => sum + (d.amount?.amountMicros || 0), 0);
  const pipeline = mockDeals.filter(d => !['WON','LOST'].includes(d.stage)).reduce((sum, d) => sum + (d.amount?.amountMicros || 0), 0);
  const activeProjects = mockProjects.filter((p) => p.status === "started").length;
  const allTasks = Object.values(mockTasks).flat();
  const overdueTasks = allTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.state.name !== "Done").length;

  // Stage distribution for pipeline
  const stages = ["LEAD","QUALIFIED","DEMO_SCHEDULED","PROPOSAL_SENT","NEGOTIATION"];
  const stageColors: Record<string, string> = {
    LEAD: "#6366f1", QUALIFIED: "#8b5cf6", DEMO_SCHEDULED: "#3b82f6",
    PROPOSAL_SENT: "#f59e0b", NEGOTIATION: "#f97316",
  };

  // Recent activity
  const recentActivity = mockActivities.slice(0, 6);

  const activityIcons: Record<string, string> = {
    won: "🏆", created: "✨", updated: "📝", completed: "✅", assigned: "👤",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Your business overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Leads" value={String(leads)} sub="In pipeline" icon={TrendingUp} color="#6366f1" />
        <StatCard label="Active Deals" value={String(activeDeals)} sub={formatCurrency(pipeline) + " pipeline"} icon={DollarSign} color="#f59e0b" />
        <StatCard label="Won Deals" value={String(wonDeals.length)} sub={formatCurrency(revenue) + " revenue"} icon={Trophy} color="#22c55e" />
        <StatCard label="Active Projects" value={String(activeProjects)} sub={`${overdueTasks} overdue tasks`} icon={FolderKanban} color="#3b82f6" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Sales Pipeline</h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{activeDeals} active deals</span>
          </div>
          <div className="space-y-3">
            {stages.map((stage) => {
              const count = mockDeals.filter((d) => d.stage === stage).length;
              const amount = mockDeals.filter((d) => d.stage === stage).reduce((s, d) => s + (d.amount?.amountMicros || 0), 0);
              const pct = activeDeals > 0 ? (count / activeDeals) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{dealStageLabel(stage)}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{count} deals</span>
                      <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{formatCurrency(amount)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-overlay)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: stageColors[stage] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">{activityIcons[act.action] || "📌"}</span>
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>{act.actor}</span>{" "}
                    {act.action} {act.metadata?.dealName || act.metadata?.projectName || act.metadata?.taskName || act.metadata?.contactName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{formatRelativeTime(act.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects + Tasks row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="rounded-xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Active Projects</h2>
          <div className="space-y-3">
            {mockProjects.filter(p => p.status === "started").map((p) => {
              const pct = p.totalIssues > 0 ? Math.round((p.completedIssues / p.totalIssues) * 100) : 0;
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{p.name}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-overlay)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.client}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>·</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.completedIssues}/{p.totalIssues} tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="rounded-xl p-5" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Recent Tasks</h2>
          <div className="space-y-2">
            {allTasks.slice(0, 5).map((task) => {
              const priorityColors: Record<string, string> = { urgent: "#ef4444", high: "#f97316", medium: "#f59e0b", low: "#3b82f6" };
              return (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: "var(--bg-overlay)" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: task.state.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{task.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{task.assignees?.[0]?.displayName}</p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: priorityColors[task.priority] || "var(--text-muted)" }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
