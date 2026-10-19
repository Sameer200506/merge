"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Mail, Phone, Building2, MoreHorizontal } from "lucide-react";
import { mockContacts } from "@/lib/mock-data";
import { getInitials, formatDate } from "@/lib/utils/format";
import type { Contact } from "@/types";

export default function ContactsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", jobTitle: "", company: "" });

  const filtered = contacts.filter(
    (c) =>
      `${c.name.firstName} ${c.name.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const newContact: Contact = {
      id: `c${Date.now()}`,
      name: { firstName: form.firstName, lastName: form.lastName },
      email: form.email,
      phone: form.phone,
      jobTitle: form.jobTitle,
      company: form.company ? { id: `co${Date.now()}`, name: form.company } : undefined,
      createdAt: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);
    setShowForm(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", jobTitle: "", company: "" });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Contacts</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{contacts.length} contacts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white transition-all"
          style={{ background: "var(--accent)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-hover)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
        >
          <Plus className="w-4 h-4" /> New Contact
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {["Name", "Email", "Phone", "Company", "Title", "Added"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => router.push(`/crm/contacts/${c.id}`)}
                className="transition-all cursor-pointer"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
                      {getInitials(`${c.name.firstName} ${c.name.lastName}`)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.name.firstName} {c.name.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {c.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.phone}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {c.company && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.company.name}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{c.jobTitle}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{formatDate(c.createdAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No contacts found</p>
          </div>
        )}
      </div>

      {/* Create form slide-over */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(0,0,0,0.6)" }} onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="ml-auto w-full max-w-md h-full p-6 overflow-y-auto animate-slide-in" style={{ background: "var(--bg-elevated)", borderLeft: "1px solid var(--border)" }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text-primary)" }}>New Contact</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[["firstName","First Name"],["lastName","Last Name"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
                    <input value={form[key as keyof typeof form]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                ))}
              </div>
              {[["email","Email","email"],["phone","Phone","tel"],["jobTitle","Job Title","text"],["company","Company","text"]].map(([key,label,type]) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
                  <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
                <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Create Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
