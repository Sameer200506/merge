"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, CalendarDays, KanbanSquare, AlignJustify } from "lucide-react";
import { mockProjects, mockTasks, mockActivities } from "@/lib/mock-data";
import { formatDate, projectStatusLabel, getInitials } from "@/lib/utils/format";
import type { Task, TaskPriority } from "@/types";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "roadmap" | "members" | "activity">("tasks");
  const [tasksView, setTasksView] = useState<"kanban" | "list" | "calendar">("kanban");

  const project = mockProjects.find((p) => p.id === projectId);
  const [tasks, setTasks] = useState<Task[]>(() => mockTasks[projectId] || []);
  const [newTaskName, setNewTaskName] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Project not found</h2>
        <button onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  // Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.state.name === "Done").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks for Kanban
  const states = ["Todo", "In Progress", "In Review", "Done"];
  const stateColors: Record<string, string> = {
    "Todo": "#71717a",
    "In Progress": "#6366f1",
    "In Review": "#f59e0b",
    "Done": "#22c55e",
  };

  // Activity logs related to this project
  const projectActivities = mockActivities.filter(
    (a) => a.entityType === "project" && a.entityId === projectId
  );

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask: Task = {
      id: `t${Date.now()}`,
      name: newTaskName,
      description: "",
      priority: newTaskPriority,
      state: { name: "Todo", color: "#71717a" },
      assignees: [{ displayName: "Alex Kim" }],
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split("T")[0],
      projectId,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskName("");
    setShowTaskForm(false);
    toast.success("Task created successfully");
  }

  function handleStatusChange(taskId: string, newStatus: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, state: { name: newStatus, color: stateColors[newStatus] || "#71717a" } }
          : t
      )
    );
    toast.success(`Task status updated to ${newStatus}`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium transition-all"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl animate-scale-up" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              <span className="text-white font-bold text-sm">[{project.identifier}]</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-white">{project.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--bg-active)", color: "var(--text-secondary)" }}>
                  {projectStatusLabel(project.status)}
                </span>
              </div>
              <p className="text-sm mt-0.5 text-zinc-400">
                Client: <span className="text-zinc-200 font-semibold">{project.client || "Internal"}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6">
            <div className="w-32">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                <span className="font-semibold text-white">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-overlay)" }}>
                <div className="h-full transition-all duration-500 bg-indigo-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        {(["overview", "tasks", "roadmap", "members", "activity"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium transition-all capitalize"
            style={{
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-secondary)",
              borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-2px",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold text-white">Project Description</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.description || "No description provided for this project."}
              </p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl p-4 space-y-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Tasks</span>
                <p className="text-2xl font-bold text-white">{totalTasks}</p>
              </div>
              <div className="rounded-xl p-4 space-y-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Completed Tasks</span>
                <p className="text-2xl font-bold text-white">{completedTasks}</p>
              </div>
              <div className="rounded-xl p-4 space-y-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Active Members</span>
                <p className="text-2xl font-bold text-white">{project.members?.length || 1}</p>
              </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold text-white">Timeline & Details</h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="block mb-1 text-zinc-500">START DATE</span>
                <span className="font-semibold text-white">{project.startDate ? formatDate(project.startDate) : "—"}</span>
              </div>
              <div>
                <span className="block mb-1 text-zinc-500">TARGET DELIVERY</span>
                <span className="font-semibold text-white">{project.targetDate ? formatDate(project.targetDate) : "—"}</span>
              </div>
              <div>
                <span className="block mb-1 text-zinc-500">ENGINE SOURCE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 uppercase tracking-wider">Plane Work Engine</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="space-y-4 flex flex-col flex-1">
          {/* Subheader view switcher */}
          <div className="flex items-center justify-between">
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <button onClick={() => setTasksView("kanban")} className="px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all" style={{ background: tasksView === "kanban" ? "var(--bg-active)" : "transparent", color: tasksView === "kanban" ? "var(--text-primary)" : "var(--text-secondary)" }}>
                <KanbanSquare className="w-3.5 h-3.5" /> Kanban
              </button>
              <button onClick={() => setTasksView("list")} className="px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all" style={{ background: tasksView === "list" ? "var(--bg-active)" : "transparent", color: tasksView === "list" ? "var(--text-primary)" : "var(--text-secondary)", borderLeft: "1px solid var(--border)" }}>
                <AlignJustify className="w-3.5 h-3.5" /> List
              </button>
              <button onClick={() => setTasksView("calendar")} className="px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all" style={{ background: tasksView === "calendar" ? "var(--bg-active)" : "transparent", color: tasksView === "calendar" ? "var(--text-primary)" : "var(--text-secondary)", borderLeft: "1px solid var(--border)" }}>
                <CalendarDays className="w-3.5 h-3.5" /> Calendar
              </button>
            </div>

            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: "var(--accent)" }}
            >
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>

          {/* Kanban View */}
          {tasksView === "kanban" && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {states.map((st) => {
                const stateTasks = tasks.filter((t) => t.state.name === st);
                return (
                  <div key={st} className="flex-shrink-0 w-64 rounded-xl flex flex-col p-2 space-y-3" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-between px-2 py-1" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: stateColors[st] }} />
                        <span className="text-xs font-bold text-white">{st}</span>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded text-zinc-400" style={{ background: "var(--bg-overlay)" }}>{stateTasks.length}</span>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto max-h-96 pr-1">
                      {stateTasks.map((t) => (
                        <div key={t.id} className="rounded-lg p-3 space-y-3" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
                          <p className="text-xs font-medium text-white">{t.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-red-500/10 text-red-400">
                              {t.priority}
                            </span>

                            <select
                              value={t.state.name}
                              onChange={(e) => handleStatusChange(t.id, e.target.value)}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 outline-none border border-zinc-700"
                            >
                              {states.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                      {stateTasks.length === 0 && (
                        <div className="py-8 text-center text-xs text-zinc-500">
                          Empty column
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {tasksView === "list" && (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Task Title", "Status", "Priority", "Due Date"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td className="px-6 py-4 text-sm font-medium text-white">{t.name}</td>
                      <td className="px-6 py-4">
                        <select
                          value={t.state.name}
                          onChange={(e) => handleStatusChange(t.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300 outline-none border border-zinc-700"
                        >
                          {states.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-0.5 rounded uppercase font-semibold bg-red-500/10 text-red-400">
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-400">
                        {t.dueDate ? formatDate(t.dueDate) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tasks.length === 0 && (
                <div className="py-12 text-center text-sm text-zinc-500">No tasks found.</div>
              )}
            </div>
          )}

          {/* Calendar View */}
          {tasksView === "calendar" && (
            <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-zinc-500 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  // Simple mock calendar mapping
                  const dayTasks = tasks.filter((t) => {
                    const day = t.dueDate ? parseInt(t.dueDate.split("-")[2]) : 0;
                    return day === dayNum;
                  });
                  return (
                    <div key={idx} className="min-h-16 rounded-lg p-1.5 flex flex-col justify-between" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
                      <span className="text-[10px] font-semibold text-zinc-400">{dayNum}</span>
                      <div className="space-y-1 mt-1">
                        {dayTasks.map((t) => (
                          <div key={t.id} className="text-[9px] px-1 py-0.5 rounded truncate font-medium text-white bg-indigo-600">
                            {t.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Roadmap Tab */}
      {activeTab === "roadmap" && (
        <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold text-white">Sprints / Cycles</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl space-y-2" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Sprint 1: Core Features Scaffold</h4>
                  <span className="text-xs text-zinc-400">June 01 - June 15</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Active</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <div className="h-full bg-emerald-500" style={{ width: "70%" }} />
              </div>
            </div>

            <div className="p-4 rounded-xl space-y-2 opacity-60" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Sprint 2: CRM GraphQL Wiring</h4>
                  <span className="text-xs text-zinc-400">June 16 - June 30</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold text-white">Project Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(project.members || [{ displayName: "Alex Kim" }]).map((m, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #1f1f23, #2d2d35)" }}>
                  {getInitials(m.displayName)}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{m.displayName}</p>
                  <p className="text-[10px] text-zinc-400">Role: Contributor</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold text-white">Project Activities</h3>
          <div className="relative pl-6 space-y-6" style={{ borderLeft: "1px solid var(--border)" }}>
            {projectActivities.map((act) => (
              <div key={act.id} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0a0a0b]" />
                <div className="space-y-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{act.actor}</span> {act.action} project <span className="font-medium">&quot;{act.metadata.projectName || act.entityId}&quot;</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {new Date(act.createdAt).toLocaleString()} · via {act.source.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
            {projectActivities.length === 0 && (
              <div className="text-center py-6 text-xs text-zinc-500">No activities recorded for this project.</div>
            )}
          </div>
        </div>
      )}

      {/* Create Task Slide-over */}
      {showTaskForm && (
        <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.6)" }} onClick={(e) => e.target === e.currentTarget && setShowTaskForm(false)}>
          <div className="ml-auto w-full max-w-sm h-full p-6 overflow-y-auto animate-slide-in" style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)" }}>
            <h2 className="text-base font-semibold mb-6 text-white">New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-zinc-400">Task Name</label>
                <input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} placeholder="What needs to be done?" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-zinc-400">Priority</label>
                <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Critical</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTaskForm(false)} className="flex-1 py-2 rounded-lg text-sm text-zinc-400" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
