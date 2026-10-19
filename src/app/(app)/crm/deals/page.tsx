"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Kanban, Table2, DollarSign, Trophy } from "lucide-react";
import { mockDeals } from "@/lib/mock-data";
import { formatCurrency, dealStageLabel, getInitials } from "@/lib/utils/format";
import type { Deal } from "@/types";
import { toast } from "sonner";

const STAGES = ["LEAD","QUALIFIED","DEMO_SCHEDULED","PROPOSAL_SENT","NEGOTIATION","WON","LOST"] as const;
type Stage = typeof STAGES[number];

const stageColors: Record<Stage, string> = {
  LEAD: "#6366f1", QUALIFIED: "#8b5cf6", DEMO_SCHEDULED: "#3b82f6",
  PROPOSAL_SENT: "#f59e0b", NEGOTIATION: "#f97316", WON: "#22c55e", LOST: "#ef4444",
};

function WonModal({ deal, onClose, onConfirm }: { deal: Deal; onClose: () => void; onConfirm: (pm: string) => void }) {
  const [pm, setPm] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleConfirm() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    onConfirm(pm);
  }
  return (
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
          <select value={pm} onChange={e => setPm(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
            <option value="">Select team member...</option>
            <option value="jordan@startupos.com">Jordan Lee — Project Manager</option>
            <option value="riley@startupos.com">Riley Chen — Team Member</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2" style={{ background: loading ? "var(--accent-muted)" : "var(--success)" }}>
            {loading ? <span className="animate-spin">⟳</span> : <Trophy className="w-4 h-4" />}
            {loading ? "Creating..." : "Create Project →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const router = useRouter();
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [deals, setDeals] = useState<Deal[]>(mockDeals as Deal[]);
  const [showForm, setShowForm] = useState(false);
  const [wonDeal, setWonDeal] = useState<Deal | null>(null);
  const [dragDealId, setDragDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Stage | null>(null);
  const [form, setForm] = useState({ name: "", company: "", stage: "LEAD" as Stage, amount: "" });

  function handleDrop(stage: Stage) {
    if (!dragDealId) return;
    const deal = deals.find(d => d.id === dragDealId);
    if (!deal) return;
    if (stage === "WON" && deal.stage !== "WON") {
      setWonDeal({ ...deal, stage: "WON" });
    }
    setDeals(prev => prev.map(d => d.id === dragDealId ? { ...d, stage } : d));
    setDragDealId(null);
    setDragOverStage(null);
  }

  function handleWonConfirm(pm: string) {
    toast.success(`Project created for "${wonDeal?.name}"! 🚀`, { 
      description: pm ? `Assigned to PM: ${pm}` : "Auto-created in Work → Projects" 
    });
    setWonDeal(null);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newDeal: Deal = {
      id: `d${Date.now()}`,
      name: form.name,
      stage: form.stage,
      amount: form.amount ? { amountMicros: parseFloat(form.amount) * 1_000_000, currencyCode: "USD" } : undefined,
      company: form.company ? { id: `co${Date.now()}`, name: { text: form.company } } : undefined,
      createdAt: new Date().toISOString(),
    };
    setDeals(prev => [newDeal, ...prev]);
    setShowForm(false);
  }

  return (
    <div className="space-y-6 animate-fade-in" style={{ height: "calc(100vh - 128px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Deals</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{deals.filter(d => !['WON','LOST'].includes(d.stage)).length} active · {formatCurrency(deals.filter(d=>!['WON','LOST'].includes(d.stage)).reduce((s,d)=>s+(d.amount?.amountMicros||0),0))} pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <button onClick={() => setView("kanban")} className="px-3 py-1.5 text-sm flex items-center gap-1.5 transition-all" style={{ background: view === "kanban" ? "var(--bg-active)" : "transparent", color: view === "kanban" ? "var(--text-primary)" : "var(--text-secondary)" }}>
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
            <button onClick={() => setView("table")} className="px-3 py-1.5 text-sm flex items-center gap-1.5 transition-all" style={{ background: view === "table" ? "var(--bg-active)" : "transparent", color: view === "table" ? "var(--text-primary)" : "var(--text-secondary)", borderLeft: "1px solid var(--border)" }}>
              <Table2 className="w-3.5 h-3.5" /> Table
            </button>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>
            <Plus className="w-4 h-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="flex gap-3 overflow-x-auto flex-1 pb-4">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const isDragOver = dragOverStage === stage;
            return (
              <div
                key={stage}
                className="flex-shrink-0 w-60 rounded-xl flex flex-col"
                style={{ background: isDragOver ? "var(--accent-muted)" : "var(--bg-elevated)", border: `1px solid ${isDragOver ? "var(--accent)" : "var(--border)"}`, transition: "all 0.15s" }}
                onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage); }}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={() => handleDrop(stage)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: stageColors[stage] }} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{dealStageLabel(stage)}</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--bg-overlay)", color: "var(--text-muted)" }}>{stageDeals.length}</span>
                </div>
                {/* Cards */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDragDealId(deal.id)}
                      onDragEnd={() => setDragDealId(null)}
                      className="rounded-lg p-3 cursor-grab active:cursor-grabbing kanban-card"
                      style={{ background: dragDealId === deal.id ? "var(--bg-active)" : "var(--bg-overlay)", border: "1px solid var(--border)", opacity: dragDealId === deal.id ? 0.5 : 1 }}
                    >
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                        <Link href={`/crm/deals/${deal.id}`} className="hover:underline hover:text-[var(--accent)] transition-all">
                          {deal.name}
                        </Link>
                      </p>
                      {deal.company && <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>{deal.company.name.text}</p>}
                      <div className="flex items-center justify-between">
                        {deal.amount && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" style={{ color: stageColors[stage] }} />
                            <span className="text-xs font-semibold" style={{ color: stageColors[stage] }}>{formatCurrency(deal.amount.amountMicros)}</span>
                          </div>
                        )}
                        {deal.assignee && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ml-auto" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                            {getInitials(`${deal.assignee.name.firstName} ${deal.assignee.name.lastName}`)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="rounded-xl overflow-hidden flex-1" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Deal","Company","Stage","Amount","Owner"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id} onClick={() => router.push(`/crm/deals/${d.id}`)} className="cursor-pointer" style={{ borderBottom: "1px solid var(--border-subtle)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{d.name}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{d.company?.name?.text}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: stageColors[d.stage] + "20", color: stageColors[d.stage] }}>{dealStageLabel(d.stage)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{d.amount ? formatCurrency(d.amount.amountMicros) : "—"}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{d.assignee ? `${d.assignee.name.firstName} ${d.assignee.name.lastName}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {wonDeal && <WonModal deal={wonDeal} onClose={() => { setDeals(prev => prev.map(d => d.id === wonDeal.id ? { ...d, stage: "NEGOTIATION" as Stage } : d)); setWonDeal(null); }} onConfirm={handleWonConfirm} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.6)" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="ml-auto w-full max-w-md h-full p-6 overflow-y-auto animate-slide-in" style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)" }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>New Deal</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Deal Name</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} required /></div>
              <div><label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Company</label><input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>
              <div><label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Stage</label>
                <select value={form.stage} onChange={e => setForm(f => ({...f, stage: e.target.value as Stage}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}>
                  {STAGES.filter(s => s !== "WON" && s !== "LOST").map(s => <option key={s} value={s}>{dealStageLabel(s)}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Amount ($)</label><input type="number" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
