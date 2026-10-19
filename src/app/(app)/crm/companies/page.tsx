"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Globe, Users, MoreHorizontal } from "lucide-react";
import { mockCompanies } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils/format";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [form, setForm] = useState({ name: "", website: "", industry: "", employees: "" });

  const filtered = companies.filter(
    (c) => c.name.text.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newCompany: Company = {
      id: `co${Date.now()}`,
      name: { text: form.name },
      domainName: { primaryLinkUrl: form.website },
      industryCategory: form.industry,
      employees: form.employees ? parseInt(form.employees) : undefined,
      createdAt: new Date().toISOString(),
    };
    setCompanies((prev) => [newCompany, ...prev]);
    setShowForm(false);
    setForm({ name: "", website: "", industry: "", employees: "" });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Companies</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{companies.length} companies</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>
          <Plus className="w-4 h-4" /> New Company
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies..." className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} onClick={() => router.push(`/crm/companies/${c.id}`)} className="rounded-xl p-4 transition-all cursor-pointer" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #1f1f23, #2d2d35)" }}>
                  {getInitials(c.name.text)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{c.name.text}</p>
                  {c.industryCategory && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.industryCategory}</p>}
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); }} className="text-muted"><MoreHorizontal className="w-4 h-4" style={{ color: "var(--text-muted)" }} /></button>
            </div>
            <div className="mt-3 space-y-1.5">
              {c.domainName?.primaryLinkUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{c.domainName.primaryLinkUrl}</span>
                </div>
              )}
              {c.employees && (
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{c.employees} employees</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.6)" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="ml-auto w-full max-w-md h-full p-6 overflow-y-auto animate-slide-in" style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)" }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>New Company</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {[["name","Company Name"],["website","Website"],["industry","Industry"],["employees","Employees"]].map(([key,label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
                  <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
