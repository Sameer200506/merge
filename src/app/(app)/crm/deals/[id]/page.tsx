"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, DollarSign, Building2, Calendar, User, Trophy, CheckCircle } from "lucide-react";
import { mockDeals, mockCompanies, mockContacts, mockActivities } from "@/lib/mock-data";
import { formatDate, formatCurrency, dealStageLabel } from "@/lib/utils/format";
import Link from "next/link";
import { toast } from "sonner";
import type { Deal } from "@/types";

const STAGES = ["LEAD", "QUALIFIED", "DEMO_SCHEDULED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"] as const;
type Stage = typeof STAGES[number];

const stageColors: Record<Stage, string> = {
  LEAD: "#6366f1",
  QUALIFIED: "#8b5cf6",
  DEMO_SCHEDULED: "#3b82f6",
  PROPOSAL_SENT: "#f59e0b",
  NEGOTIATION: "#f97316",
  WON: "#22c55e",
  LOST: "#ef4444",
};

export default function DealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "activity" >("overview");

  const [deal, setDeal] = useState<Deal | undefined>(() => mockDeals.find((d) => d.id === id) as Deal | undefined);
  const [showWonModal, setShowWonModal] = useState(false);
  const [pmEmail, setPmEmail] = useState("");
  const [pmLoading, setPmLoading] = useState(false);

  if (!deal) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Deal not found</h2>
        <button onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  const company = mockCompanies.find((c) => c.id === deal.company?.id);
  const contacts = company ? mockContacts.filter((c) => c.company?.id === company.id) : [];

  const relatedActivities = mockActivities.filter(
    (a) => a.entityType === "deal" && a.entityId === id
  );

  function handleStageChange(newStage: Stage) {
    if (newStage === "WON") {
      setShowWonModal(true);
      return;
    }
    setDeal((prev) => prev ? { ...prev, stage: newStage } : undefined);
    toast.success(`Deal stage updated to ${dealStageLabel(newStage)}`);
  }

  async function handleWonConfirm() {
    if (!deal) return;
    setPmLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setPmLoading(false);
    setDeal((prev) => prev ? { ...prev, stage: "WON" } : undefined);
    setShowWonModal(false);
    toast.success(`Project created for "${deal.name}"! 🚀`, {
      description: `Auto-created in Work → Projects${pmEmail ? ` and assigned to ${pmEmail}` : ""}`,
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-medium transition-all"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Deals
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
              <Trophy className="w-6 h-6" style={{ color: stageColors[deal.stage] }} />
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{deal.name}</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {deal.company?.name?.text && `Company: ${deal.company.name.text}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {deal.stage !== "WON" ? (
              <button
                onClick={() => setShowWonModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all bg-emerald-600 hover:bg-emerald-500"
              >
                <Trophy className="w-4 h-4" /> Mark as Won
              </button>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10">
                <CheckCircle className="w-4 h-4" /> Deal Won
              </span>
            )}

            <select
              value={deal.stage}
              onChange={(e) => handleStageChange(e.target.value as Stage)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {dealStageLabel(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Amount</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {deal.amount ? formatCurrency(deal.amount.amountMicros) : "—"}
                  </span>
                </div>
              </div>

              {deal.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Company</span>
                    <Link href={`/crm/companies/${deal.company.id}`} className="text-sm font-medium transition-all hover:underline" style={{ color: "var(--accent)" }}>
                      {deal.company.name.text}
                    </Link>
                  </div>
                </div>
              )}

              {deal.closeDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Expected Close</span>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {formatDate(deal.closeDate)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Owner</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {deal.assignee ? `${deal.assignee.name.firstName} ${deal.assignee.name.lastName}` : "Alex Kim"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Contents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
            {(["overview", "notes", "activity"] as const).map((tab) => (
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

          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Associated Contacts */}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Associated Contacts</h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Name", "Position", "Email"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td className="px-6 py-4">
                          <Link href={`/crm/contacts/${c.id}`} className="text-sm font-medium transition-all hover:underline" style={{ color: "var(--text-primary)" }}>
                            {c.name.firstName} {c.name.lastName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {c.jobTitle || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {c.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contacts.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No contacts found under this company.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Deal Notes</h3>
              <textarea
                placeholder="Enter internal notes regarding this negotiation..."
                className="w-full h-32 p-3 rounded-lg text-sm outline-none resize-none transition-all"
                style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <div className="flex justify-end">
                <button className="px-3.5 py-2 rounded-lg text-xs font-medium text-white transition-all bg-indigo-600 hover:bg-indigo-500">
                  Save Note
                </button>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Activity Feed</h3>
              <div className="relative pl-6 space-y-6" style={{ borderLeft: "1px solid var(--border)" }}>
                {relatedActivities.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0a0a0b]" />
                    <div className="space-y-1">
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        <span className="font-semibold">{act.actor}</span> {act.action} deal <span className="font-medium">&quot;{act.metadata.dealName || act.entityId}&quot;</span>
                      </p>
                      {act.metadata.stage && (
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          Stage updated to <span className="font-semibold">{act.metadata.stage}</span>
                        </p>
                      )}
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {new Date(act.createdAt).toLocaleString()} · via {act.source.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
                {relatedActivities.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No recorded activity for this deal.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deal Won Automation Modal */}
      {showWonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md mx-4 rounded-xl p-6 animate-fade-in" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Deal Won!</h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>A project will be auto-created for this client.</p>
            </div>
            <div className="rounded-lg p-3 mb-5" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{deal.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{deal.company?.name?.text} · {deal.amount ? formatCurrency(deal.amount.amountMicros) : "—"}</p>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Assign Project Manager (optional)</label>
              <select value={pmEmail} onChange={(e) => setPmEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                <option value="">Select team member...</option>
                <option value="jordan@startupos.com">Jordan Lee — Project Manager</option>
                <option value="riley@startupos.com">Riley Chen — Team Member</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWonModal(false)} className="flex-1 py-2.5 rounded-lg text-sm" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
              <button onClick={handleWonConfirm} disabled={pmLoading} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: pmLoading ? "var(--accent-muted)" : "var(--success)" }}>
                {pmLoading ? <span className="animate-spin">⟳</span> : <Trophy className="w-4 h-4" />}
                {pmLoading ? "Creating..." : "Create Project →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
