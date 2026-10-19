"use client";

import { useState } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { mockProjects } from "@/lib/mock-data";
import { formatDate, getInitials, projectStatusLabel } from "@/lib/utils/format";
import Link from "next/link";
import type { Project } from "@/types";

const statusColors: Record<string, string> = {
  backlog: "#6366f1",
  started: "#22c55e",
  paused: "#f59e0b",
  completed: "#3b82f6",
  cancelled: "#52525b",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>(mockProjects as Project[]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", client: "", description: "", startDate: "", targetDate: "" });

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: form.name,
      identifier: form.name.slice(0, 4).toUpperCase(),
      description: form.description,
      status: "backlog",
      client: form.client,
      startDate: form.startDate,
      targetDate: form.targetDate,
      totalIssues: 0,
      completedIssues: 0,
      members: [],
    };
    setProjects(prev => [newProject, ...prev]);
    setShowForm(false);
    setForm({ name: "", client: "", description: "", startDate: "", targetDate: "" });
  }

  const filters = ["all", "started", "backlog", "paused", "completed"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Projects</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{projects.length} projects</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs font-medium capitalize transition-all"
              style={{ background: filter === f ? "var(--bg-active)" : "transparent", color: filter === f ? "var(--text-primary)" : "var(--text-secondary)", borderRight: f !== "completed" ? "1px solid var(--border)" : undefined }}>
              {f === "started" ? "Active" : f === "backlog" ? "Planning" : f === "paused" ? "Review" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const pct = p.totalIssues > 0 ? Math.round((p.completedIssues / p.totalIssues) * 100) : 0;
          return (
            <Link href={`/work/projects/${p.id}`} key={p.id}>
              <div className="rounded-xl p-4 h-full transition-all cursor-pointer" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--bg-overlay)", color: "var(--text-muted)" }}>{p.identifier}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: statusColors[p.status] + "20", color: statusColors[p.status] }}>{projectStatusLabel(p.status)}</span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                    {p.client && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.client}</p>}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.completedIssues}/{p.totalIssues} tasks</span>
                    <span className="text-xs font-medium" style={{ color: pct > 75 ? "var(--success)" : "var(--text-muted)" }}>{pct}%</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "var(--bg-overlay)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 75 ? "var(--success)" : "var(--accent)" }} />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  {/* Members */}
                  <div className="flex -space-x-2">
                    {p.members?.slice(0, 3).map((m, i) => (
                      <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)", boxShadow: "0 0 0 2px var(--bg-elevated)" }}>
                        {getInitials(m.displayName)}
                      </div>
                    ))}
                  </div>
                  {p.targetDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(p.targetDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.6)" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="ml-auto w-full max-w-md h-full p-6 overflow-y-auto animate-slide-in" style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)" }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {[["name","Project Name"],["client","Client"],["description","Description"]].map(([k,l]) => (
                <div key={k}><label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{l}</label>
                  {k === "description" ? <textarea value={form[k as keyof typeof form]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} rows={3} className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  : <input value={form[k as keyof typeof form]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} required={k==="name"} />}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {[["startDate","Start Date"],["targetDate","Due Date"]].map(([k,l]) => (
                  <div key={k}><label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{l}</label><input type="date" value={form[k as keyof typeof form]} onChange={e => setForm(f=>({...f,[k]:e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
