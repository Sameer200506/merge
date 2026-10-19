"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Globe, FolderKanban, Tag } from "lucide-react";
import { mockCompanies, mockContacts, mockDeals, mockProjects, mockTasks, mockActivities } from "@/lib/mock-data";
import { getInitials, formatDate, formatCurrency, dealStageLabel, projectStatusLabel } from "@/lib/utils/format";
import Link from "next/link";

export default function CustomerWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.companyId as string;
  const [activeTab, setActiveTab] = useState<"contacts" | "deals" | "projects" | "tasks" | "activity">("projects");

  const company = mockCompanies.find((c) => c.id === companyId);

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Customer Workspace not found</h2>
        <button onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  // Get matching data
  const companyContacts = mockContacts.filter((c) => c.company?.id === companyId);
  const companyDeals = mockDeals.filter((d) => d.company?.id === companyId);
  
  // Projects where client matches company name
  const companyProjects = mockProjects.filter((p) => p.client?.toLowerCase() === company.name.text.toLowerCase());
  
  // Tasks belonging to these projects
  const projectIds = companyProjects.map((p) => p.id);
  const companyTasks = Object.keys(mockTasks)
    .filter((pid) => projectIds.includes(pid))
    .flatMap((pid) => mockTasks[pid]);

  // Activities linked to company, its contacts, its deals, or its projects
  const contactIds = companyContacts.map((c) => c.id);
  const dealIds = companyDeals.map((d) => d.id);
  const relatedActivities = mockActivities.filter(
    (a) =>
      (a.entityType === "company" && a.entityId === companyId) ||
      (a.entityType === "contact" && contactIds.includes(a.entityId)) ||
      (a.entityType === "deal" && dealIds.includes(a.entityId)) ||
      (a.entityType === "project" && projectIds.includes(a.entityId))
  );

  const totalDealAmount = companyDeals.reduce((sum, d) => sum + (d.amount?.amountMicros || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Back & Breadcrumb */}
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium transition-all"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Workspace Hero Header */}
        <div className="p-6 rounded-xl relative overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          {/* Subtle accent glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10 blur-3xl rounded-full" style={{ background: "var(--accent)" }} />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                {getInitials(company.name.text)}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white leading-none">{company.name.text}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-indigo-400 bg-indigo-500/10 uppercase tracking-wider">
                    Customer Workspace
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                  {company.domainName?.primaryLinkUrl && (
                    <a href={`https://${company.domainName.primaryLinkUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline hover:text-white">
                      <Globe className="w-3.5 h-3.5" /> {company.domainName.primaryLinkUrl}
                    </a>
                  )}
                  {company.industryCategory && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-zinc-500" /> {company.industryCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Combined Metrics grid */}
            <div className="grid grid-cols-3 gap-6 md:gap-10 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-10" style={{ borderColor: "var(--border)" }}>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Total Deals</span>
                <span className="text-lg font-bold text-white">{companyDeals.length}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Active Projects</span>
                <span className="text-lg font-bold text-white">{companyProjects.length}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>Value</span>
                <span className="text-lg font-bold text-emerald-400">{formatCurrency(totalDealAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        {(["contacts", "deals", "projects", "tasks", "activity"] as const).map((tab) => (
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

      {/* Tab contents */}
      {activeTab === "contacts" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Name", "Title", "Email", "Phone"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyContacts.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="px-6 py-4">
                    <Link href={`/crm/contacts/${c.id}`} className="text-sm font-medium transition-all hover:underline text-white">
                      {c.name.firstName} {c.name.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{c.jobTitle || "—"}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{c.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {companyContacts.length === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500">No contacts found for this company.</div>
          )}
        </div>
      )}

      {activeTab === "deals" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Deal Name", "Stage", "Amount", "Expected Close"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyDeals.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="px-6 py-4">
                    <Link href={`/crm/deals/${d.id}`} className="text-sm font-medium transition-all hover:underline text-white">
                      {d.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--bg-active)", color: "var(--text-primary)" }}>
                      {dealStageLabel(d.stage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">{d.amount ? formatCurrency(d.amount.amountMicros) : "—"}</td>
                  <td className="px-6 py-4 text-sm text-zinc-300">{d.closeDate ? formatDate(d.closeDate) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {companyDeals.length === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500">No deals found for this company.</div>
          )}
        </div>
      )}

      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyProjects.map((p) => {
            const completed = p.completedIssues || 0;
            const total = p.totalIssues || 0;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <div key={p.id} className="rounded-xl p-5 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      <Link href={`/work/projects/${p.id}`} className="hover:underline">{p.name}</Link>
                    </h4>
                    <span className="text-xs text-zinc-400">Status: {projectStatusLabel(p.status)}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase" style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}>
                    {p.identifier}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--text-secondary)" }}>Issues: {completed}/{total}</span>
                    <span className="font-semibold text-white">{percent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-overlay)" }}>
                    <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs border-t pt-3" style={{ borderColor: "var(--border)" }}>
                  <span style={{ color: "var(--text-muted)" }}>Target: {p.targetDate ? formatDate(p.targetDate) : "—"}</span>
                  <Link href={`/work/projects/${p.id}`} className="text-xs font-medium transition-all hover:underline" style={{ color: "var(--accent)" }}>
                    View Project Details →
                  </Link>
                </div>
              </div>
            );
          })}
          {companyProjects.length === 0 && (
            <div className="col-span-2 rounded-xl p-8 text-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <FolderKanban className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <h4 className="text-sm font-semibold text-white">No Linked Projects</h4>
              <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                When you win a deal, a Plane Project is automatically provisioned for delivery and lifecycle tracking.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Task Title", "Project", "Priority", "Status", "Due Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider text-zinc-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyTasks.map((t) => {
                const proj = companyProjects.find((p) => p.id === t.projectId);
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="px-6 py-4 text-sm font-medium text-white">{t.name}</td>
                    <td className="px-6 py-4 text-sm text-zinc-300">{proj?.name || t.projectId}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-0.5 rounded uppercase font-semibold bg-red-500/10 text-red-400">
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-300">{t.state.name}</td>
                    <td className="px-6 py-4 text-xs text-zinc-400">{t.dueDate ? formatDate(t.dueDate) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {companyTasks.length === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500">No active tasks for this client.</div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold text-white">Unified Timeline Feed (CRM + Projects)</h3>
          <div className="relative pl-6 space-y-6" style={{ borderLeft: "1px solid var(--border)" }}>
            {relatedActivities.map((act) => (
              <div key={act.id} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0a0a0b]" />
                <div className="space-y-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{act.actor}</span> {act.action} {act.entityType} <span className="font-medium">&quot;{act.metadata.contactName || act.metadata.dealName || act.metadata.projectName || act.entityId}&quot;</span>
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {new Date(act.createdAt).toLocaleString()} · via {act.source.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
            {relatedActivities.length === 0 && (
              <div className="text-center py-6 text-xs text-zinc-500">No activities recorded for this workspace.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
