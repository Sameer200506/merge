"use client";

import { useState } from "react";
import { Settings, Users, SunMoon, Bell, Cpu, CreditCard, Plus, HelpCircle } from "lucide-react";
import { mockTeam } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils/format";
import { toast } from "sonner";
import type { UserRole } from "@/types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "members" | "appearance" | "notifications" | "integrations" | "billing">("general");

  // General Settings State
  const [orgName, setOrgName] = useState("StartupOS Demo");
  const [industry, setIndustry] = useState("Technology");

  // Members State
  const [members, setMembers] = useState(mockTeam);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Appearance State
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState("#6366f1");

  // Notifications State
  const [notifPreferences, setNotifPreferences] = useState({
    dealWon: true,
    taskAssigned: true,
    weeklyReport: false,
    projectUpdates: true,
  });

  // Integrations State
  const [twentyUrl, setTwentyUrl] = useState("http://localhost:3001");
  const [twentyToken, setTwentyToken] = useState("tw_service_token_••••••••••••••••");
  const [planeUrl, setPlaneUrl] = useState("http://localhost:8000");
  const [planeKey, setPlaneKey] = useState("pl_api_key_••••••••••••••••");

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember = {
      id: `u${Date.now()}`,
      name: inviteEmail.split("@")[0].toUpperCase(),
      email: inviteEmail,
      role: inviteRole as UserRole,
      avatarUrl: null,
      activeProjects: 0,
      openTasks: 0,
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
    toast.success(`Invitation sent to ${inviteEmail}`);
  }

  function handleRoleChange(memberId: string, newRole: string) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole as UserRole } : m))
    );
    toast.success("Member role updated");
  }

  function handleGeneralSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Organization settings saved");
  }

  function handleIntegrationsSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Integrations API credentials saved successfully");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your workspace settings and integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-1">
          {([
            { id: "general", label: "General", icon: Settings },
            { id: "members", label: "Members", icon: Users },
            { id: "appearance", label: "Appearance", icon: SunMoon },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "integrations", label: "Integrations", icon: Cpu },
            { id: "billing", label: "Billing", icon: CreditCard },
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left"
              style={{
                background: activeTab === item.id ? "var(--bg-active)" : "transparent",
                color: activeTab === item.id ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: activeTab === item.id ? 500 : 400,
              }}
            >
              <item.icon className="w-4 h-4" style={{ color: activeTab === item.id ? "var(--accent)" : "inherit" }} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            {/* General Tab */}
            {activeTab === "general" && (
              <form onSubmit={handleGeneralSave} className="space-y-4">
                <h3 className="text-sm font-semibold text-white">General Settings</h3>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-zinc-400">Organization Name</label>
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-zinc-400">Industry</label>
                  <input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  />
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all bg-indigo-600 hover:bg-indigo-500">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white">Workspace Members</h3>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all bg-indigo-600 hover:bg-indigo-500"
                  >
                    <Plus className="w-3.5 h-3.5" /> Invite Member
                  </button>
                </div>

                <div className="space-y-2">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ background: "var(--bg-overlay)", borderColor: "var(--border)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #1f1f23, #2d2d35)" }}>
                          {getInitials(m.name)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">{m.name}</p>
                          <p className="text-[10px] text-zinc-500">{m.email}</p>
                        </div>
                      </div>
                      <select
                        value={m.role}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="text-xs px-2.5 py-1.5 rounded bg-zinc-800 text-zinc-300 outline-none border border-zinc-700"
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="sales_manager">Sales Manager</option>
                        <option value="project_manager">Project Manager</option>
                        <option value="member">Team Member</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Appearance Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-zinc-400">Default Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                      style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                    >
                      <option value="dark">Dark Theme (Default)</option>
                      <option value="light">Light Theme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-zinc-400">Accent Theme Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-10 h-10 rounded border-0 outline-none cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-medium text-zinc-300">{accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Notifications Preferences</h3>
                <div className="space-y-3">
                  {[
                    { key: "dealWon", label: "Notify when a Deal is won (automations)" },
                    { key: "taskAssigned", label: "Notify when a Task is assigned to me" },
                    { key: "projectUpdates", label: "Notify when Project status changes" },
                    { key: "weeklyReport", label: "Email weekly project delivery analytics reports" },
                  ].map((pref) => (
                    <label key={pref.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifPreferences[pref.key as keyof typeof notifPreferences]}
                        onChange={(e) =>
                          setNotifPreferences((prev) => ({ ...prev, [pref.key]: e.target.checked }))
                        }
                        className="rounded border-zinc-700 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className="text-xs text-zinc-300">{pref.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <form onSubmit={handleIntegrationsSave} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Engine Integration Credentials</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Configure connections to self-hosted Twenty and Plane Docker instances.</p>
                  </div>
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                </div>

                <div className="space-y-4">
                  {/* Twenty CRM */}
                  <div className="p-4 rounded-lg space-y-3 border" style={{ background: "var(--bg-overlay)", borderColor: "var(--border)" }}>
                    <h4 className="text-xs font-bold text-indigo-400">Twenty CRM connection</h4>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-zinc-500">API URL</label>
                      <input
                        value={twentyUrl}
                        onChange={(e) => setTwentyUrl(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded text-xs outline-none bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-zinc-500">Service Token</label>
                      <input
                        type="password"
                        value={twentyToken}
                        onChange={(e) => setTwentyToken(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded text-xs outline-none bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                  </div>

                  {/* Plane Project */}
                  <div className="p-4 rounded-lg space-y-3 border" style={{ background: "var(--bg-overlay)", borderColor: "var(--border)" }}>
                    <h4 className="text-xs font-bold text-emerald-400">Plane Work Engine connection</h4>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-zinc-500">API URL</label>
                      <input
                        value={planeUrl}
                        onChange={(e) => setPlaneUrl(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded text-xs outline-none bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-zinc-500">API Key</label>
                      <input
                        type="password"
                        value={planeKey}
                        onChange={(e) => setPlaneKey(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded text-xs outline-none bg-zinc-900 border border-zinc-800 text-zinc-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all bg-indigo-600 hover:bg-indigo-500">
                    Verify & Save integrations
                  </button>
                </div>
              </form>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Billing Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {[
                    { name: "Free Tier", price: "$0", desc: "Up to 3 members, Basic CRM & Task boards", active: true },
                    { name: "Pro Tier", price: "$49/mo", desc: "Uncapped members, Deal → Project automations, Customer 360° workspace", active: false },
                    { name: "Enterprise", price: "$199/mo", desc: "High availability Docker configurations, Custom support SLA", active: false },
                  ].map((plan, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl flex flex-col justify-between border space-y-3"
                      style={{
                        background: plan.active ? "var(--bg-overlay)" : "transparent",
                        borderColor: plan.active ? "var(--accent)" : "var(--border)",
                      }}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{plan.name}</h4>
                        <p className="text-lg font-extrabold text-white mt-1">{plan.price}</p>
                        <p className="text-[10px] text-zinc-500 mt-2">{plan.desc}</p>
                      </div>
                      <button
                        className="w-full py-1.5 rounded text-xs font-semibold"
                        style={{
                          background: plan.active ? "var(--accent)" : "var(--bg-overlay)",
                          color: "white",
                        }}
                      >
                        {plan.active ? "Current Plan" : "Upgrade Plan"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm mx-4 rounded-xl p-6 animate-fade-in" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-4 text-white">Invite Team Member</h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 text-zinc-400">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 text-zinc-400">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                >
                  <option value="member">Team Member</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="sales_manager">Sales Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-2 rounded-lg text-sm text-zinc-400" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Invite Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
