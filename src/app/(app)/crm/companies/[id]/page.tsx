"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Globe, Calendar, ExternalLink, DollarSign } from "lucide-react";
import { mockCompanies, mockContacts, mockDeals, mockActivities } from "@/lib/mock-data";
import { getInitials, formatDate, formatCurrency, dealStageLabel } from "@/lib/utils/format";
import Link from "next/link";

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"contacts" | "deals" | "activity">("contacts");

  const company = mockCompanies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Company not found</h2>
        <button onClick={() => router.back()} className="mt-4 inline-flex items-center gap-2 text-sm font-medium" style={{ color: "var(--accent)" }}>
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  // Get contacts under this company
  const companyContacts = mockContacts.filter((c) => c.company?.id === id);

  // Get deals matching the company
  const companyDeals = mockDeals.filter((d) => d.company?.id === id);

  // Get activities related to this company or contacts under it
  const contactIds = companyContacts.map((c) => c.id);
  const relatedActivities = mockActivities.filter(
    (a) =>
      (a.entityType === "company" && a.entityId === id) ||
      (a.entityType === "contact" && contactIds.includes(a.entityId)) ||
      (a.entityType === "deal" && companyDeals.map((d) => d.id).includes(a.entityId))
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
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Companies
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center text-lg font-semibold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #1f1f23, #2d2d35)" }}>
              {getInitials(company.name.text)}
            </div>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>{company.name.text}</h1>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {company.industryCategory || "No Industry"} · {company.employees || "—"} employees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/customers/${company.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-white transition-all"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--accent)")}
            >
              Open 360° Customer Workspace <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Details Sidebar & Main Contents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>About</h3>
            <div className="space-y-4">
              {company.domainName?.primaryLinkUrl && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Website</span>
                    <a href={`https://${company.domainName.primaryLinkUrl}`} target="_blank" rel="noreferrer" className="text-sm font-medium transition-all hover:underline flex items-center gap-1" style={{ color: "var(--accent)" }}>
                      {company.domainName.primaryLinkUrl} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
              {company.annualRecurringRevenue && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                  <div>
                    <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Annual Revenue</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {formatCurrency(company.annualRecurringRevenue.amountMicros)}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
                <div>
                  <span className="block text-[10px] uppercase font-medium tracking-wider" style={{ color: "var(--text-muted)" }}>Added on</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {formatDate(company.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tab contents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "1px" }}>
            {(["contacts", "deals", "activity"] as const).map((tab) => (
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

          {/* Tab lists */}
          {activeTab === "contacts" && (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Team Contacts</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Name", "Role/Title", "Email"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companyContacts.map((c) => (
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
              {companyContacts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No contacts found for this company.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "deals" && (
            <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Company Deals</h3>
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
                  {companyDeals.map((d) => (
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
              {companyDeals.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No deals found for this company.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="rounded-xl p-6 space-y-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Unified Company Activity</h3>
              <div className="relative pl-6 space-y-6" style={{ borderLeft: "1px solid var(--border)" }}>
                {relatedActivities.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-[#0a0a0b]" />
                    <div className="space-y-1">
                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        <span className="font-semibold">{act.actor}</span> {act.action} {act.entityType} <span className="font-medium">&quot;{act.metadata.contactName || act.metadata.dealName || act.metadata.projectName || act.entityId}&quot;</span>
                      </p>
                      {act.metadata.amount && (
                        <p className="text-xs font-medium text-emerald-400">Value: {act.metadata.amount}</p>
                      )}
                      <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {new Date(act.createdAt).toLocaleString()} · via {act.source.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
                {relatedActivities.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>No recorded activity for this company.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
