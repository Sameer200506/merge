import { mockTeam } from "@/lib/mock-data";
import { getInitials, roleLabel } from "@/lib/utils/format";

const roleColors: Record<string, string> = {
  owner: "#8b5cf6",
  admin: "#6366f1",
  sales_manager: "#3b82f6",
  project_manager: "#22c55e",
  member: "#52525b",
  guest: "#374151",
};

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Team</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{mockTeam.length} members</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Invite Member</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockTeam.map(m => (
          <div key={m.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              {getInitials(m.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{m.name}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: roleColors[m.role]+"20", color: roleColors[m.role] }}>{roleLabel(m.role)}</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{m.email}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{m.activeProjects}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>projects</p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--text-primary)" }}>{m.openTasks}</p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>tasks</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
