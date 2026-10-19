"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { mockContacts, mockDeals, mockActivities } from "@/lib/mock-data";
import { getInitials, formatDate, formatCurrency, dealStageLabel } from "@/lib/utils/format";
import Link from "next/link";

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "deals" | "activity">("overview");

  const contact = mockContacts.find((c) => c.id === id);

  if (!contact) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Contact not found</h2>
        <button onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  // Get deals matching the company
  const companyId = contact.company?.id;
  const associatedDeals = companyId ? mockDeals.filter((d) => d.company?.id === companyId) : [];

  // Get activities related to this contact
  const relatedActivities = mockActivities.filter(
    (a) => (a.entityType === "contact" && a.entityId === id) || (a.entityType === "company" && a.entityId === companyId)
  );

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
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Contacts
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
              {getInitials(`${contact.name.firstName} ${contact.name.lastName}`)}
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{contact.name.firstName} {contact.name.lastName}</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {contact.jobTitle} {contact.company && `at ${contact.company.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {contact.company && (
              <Link
                href={`/customers/${contact.company.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
              >
                Customer Workspace <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
        {(["overview", "deals", "activity"] as const).map((tab) => (
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

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Email</span>
                    <a href={`mailto:${contact.email}`} className="text-sm transition-all hover:underline" style={{ color: "var(--text-primary)" }}>{contact.email}</a>
                  </div>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                    <div>
                      <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Phone</span>
                      <a href={`tel:${contact.phone}`} className="text-sm transition-all hover:underline" style={{ color: "var(--text-primary)" }}>{contact.phone}</a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Title</span>
                    <span className="text-sm" style={{ color: "var(--text-primary)" }}>{contact.jobTitle || "—"}</span>
                  </div>
                </div>
                {contact.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                    <div>
                      <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Company</span>
                      <Link href={`/crm/companies/${contact.company.id}`} className="text-sm font-medium transition-all hover:underline" style={{ color: "var(--accent)" }}>
                        {contact.company.name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notes</h3>
              <textarea
                placeholder="Add a private note about this contact..."
                className="w-full h-24 p-3 rounded-lg text-sm outline-none resize-none transition-all"
                style={{ background: "var(--bg-overlay)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <div className="flex justify-end">
                <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all" style={{ background: "var(--accent)" }}>
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="space-y-6">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>System Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-secondary)" }}>Record Created</span>
                  <span className="flex items-center gap-1 font-medium" style={{ color: "var(--text-primary)" }}>
                    <Calendar className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} /> {formatDate(contact.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-secondary)" }}>Owner</span>
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>Alex Kim</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-secondary)" }}>CRM Source</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-indigo-400 bg-indigo-500/10">Twenty CRM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deals" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Associated Deals</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Deal Name", "Stage", "Amount", "Close Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {associatedDeals.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <td className="px-6 py-4">
                    <Link href={`/crm/deals/${d.id}`} className="text-sm font-medium transition-all hover:underline" style={{ color: "var(--text-primary)" }}>
                      {d.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--bg-active)", color: "var(--text-primary)" }}>
                      {dealStageLabel(d.stage)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {d.amount ? formatCurrency(d.amount.amountMicros) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {d.closeDate ? formatDate(d.closeDate) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {associatedDeals.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No deals associated with this contact&apos;s company.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Activity History</h3>
          <div className="relative pl-6 space-y-6" style={{ borderLeft: "1px solid var(--border)" }}>
            {relatedActivities.map((act) => (
              <div key={act.id} className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0a0a0b]" />
                <div className="space-y-1">
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                    <span className="font-semibold">{act.actor}</span> {act.action} {act.entityType} <span className="font-medium">&quot;{act.metadata.contactName || act.metadata.dealName || act.metadata.projectName || act.entityId}&quot;</span>
                  </p>
                  {act.metadata.status && (
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Status set to <span className="font-semibold">{act.metadata.status}</span>
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
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No recorded activity for this contact.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
