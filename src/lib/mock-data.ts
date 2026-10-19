// ─────────────────────────────────────────────────────────────────────────────
// StartupOS Mock Data
// Used when NEXT_PUBLIC_USE_MOCK=true or backend services aren't running
// ─────────────────────────────────────────────────────────────────────────────

export const mockContacts = [
  { id: "c1", name: { firstName: "Sarah", lastName: "Chen" }, email: "sarah.chen@acmecorp.com", phone: "+1 415 555 0101", jobTitle: "VP of Engineering", company: { id: "co1", name: "Acme Corp" }, createdAt: "2024-01-15T10:00:00Z" },
  { id: "c2", name: { firstName: "James", lastName: "Rivera" }, email: "james@techflow.io", phone: "+1 628 555 0142", jobTitle: "CEO", company: { id: "co2", name: "TechFlow" }, createdAt: "2024-02-01T09:00:00Z" },
  { id: "c3", name: { firstName: "Maya", lastName: "Patel" }, email: "maya.patel@growthco.com", phone: "+1 512 555 0188", jobTitle: "Head of Product", company: { id: "co3", name: "GrowthCo" }, createdAt: "2024-02-14T14:30:00Z" },
  { id: "c4", name: { firstName: "David", lastName: "Okonkwo" }, email: "david@nexabit.com", phone: "+1 312 555 0199", jobTitle: "CTO", company: { id: "co4", name: "NexaBit" }, createdAt: "2024-03-01T11:00:00Z" },
  { id: "c5", name: { firstName: "Emma", lastName: "Walsh" }, email: "emma.walsh@launchpad.co", phone: "+1 646 555 0121", jobTitle: "Founder", company: { id: "co5", name: "LaunchPad" }, createdAt: "2024-03-10T16:00:00Z" },
  { id: "c6", name: { firstName: "Kai", lastName: "Nakamura" }, email: "kai@axiomtech.jp", phone: "+81 3 5555 0100", jobTitle: "Director of Sales", company: { id: "co1", name: "Acme Corp" }, createdAt: "2024-03-20T08:00:00Z" },
];

export const mockCompanies = [
  { id: "co1", name: { text: "Acme Corp" }, domainName: { primaryLinkUrl: "acmecorp.com" }, industryCategory: "SaaS", employees: 120, annualRecurringRevenue: { amountMicros: 2400000000, currencyCode: "USD" }, createdAt: "2024-01-10T00:00:00Z" },
  { id: "co2", name: { text: "TechFlow" }, domainName: { primaryLinkUrl: "techflow.io" }, industryCategory: "Fintech", employees: 45, annualRecurringRevenue: { amountMicros: 800000000, currencyCode: "USD" }, createdAt: "2024-01-20T00:00:00Z" },
  { id: "co3", name: { text: "GrowthCo" }, domainName: { primaryLinkUrl: "growthco.com" }, industryCategory: "Marketing", employees: 28, annualRecurringRevenue: { amountMicros: 500000000, currencyCode: "USD" }, createdAt: "2024-02-05T00:00:00Z" },
  { id: "co4", name: { text: "NexaBit" }, domainName: { primaryLinkUrl: "nexabit.com" }, industryCategory: "Blockchain", employees: 18, annualRecurringRevenue: { amountMicros: 300000000, currencyCode: "USD" }, createdAt: "2024-02-18T00:00:00Z" },
  { id: "co5", name: { text: "LaunchPad" }, domainName: { primaryLinkUrl: "launchpad.co" }, industryCategory: "Startup Studio", employees: 9, annualRecurringRevenue: { amountMicros: 150000000, currencyCode: "USD" }, createdAt: "2024-03-01T00:00:00Z" },
];

export const mockDeals = [
  { id: "d1", name: "Acme Corp Enterprise Plan", stage: "WON", amount: { amountMicros: 24000000000, currencyCode: "USD" }, closeDate: "2024-04-30", assignee: { name: { firstName: "Alex", lastName: "Kim" } }, company: { id: "co1", name: { text: "Acme Corp" } }, createdAt: "2024-01-20T00:00:00Z" },
  { id: "d2", name: "TechFlow Growth Bundle", stage: "NEGOTIATION", amount: { amountMicros: 8500000000, currencyCode: "USD" }, closeDate: "2024-05-15", assignee: { name: { firstName: "Alex", lastName: "Kim" } }, company: { id: "co2", name: { text: "TechFlow" } }, createdAt: "2024-02-10T00:00:00Z" },
  { id: "d3", name: "GrowthCo Marketing Suite", stage: "PROPOSAL_SENT", amount: { amountMicros: 5200000000, currencyCode: "USD" }, closeDate: "2024-05-20", assignee: { name: { firstName: "Sam", lastName: "Lee" } }, company: { id: "co3", name: { text: "GrowthCo" } }, createdAt: "2024-02-25T00:00:00Z" },
  { id: "d4", name: "NexaBit Dev Platform", stage: "DEMO_SCHEDULED", amount: { amountMicros: 3600000000, currencyCode: "USD" }, closeDate: "2024-06-01", assignee: { name: { firstName: "Sam", lastName: "Lee" } }, company: { id: "co4", name: { text: "NexaBit" } }, createdAt: "2024-03-05T00:00:00Z" },
  { id: "d5", name: "LaunchPad Starter Pack", stage: "LEAD", amount: { amountMicros: 1200000000, currencyCode: "USD" }, closeDate: "2024-06-15", assignee: { name: { firstName: "Alex", lastName: "Kim" } }, company: { id: "co5", name: { text: "LaunchPad" } }, createdAt: "2024-03-15T00:00:00Z" },
  { id: "d6", name: "Acme Corp Add-On Modules", stage: "QUALIFIED", amount: { amountMicros: 9800000000, currencyCode: "USD" }, closeDate: "2024-06-30", assignee: { name: { firstName: "Alex", lastName: "Kim" } }, company: { id: "co1", name: { text: "Acme Corp" } }, createdAt: "2024-03-20T00:00:00Z" },
  { id: "d7", name: "TechFlow API Integration", stage: "LOST", amount: { amountMicros: 2100000000, currencyCode: "USD" }, closeDate: "2024-04-01", assignee: { name: { firstName: "Sam", lastName: "Lee" } }, company: { id: "co2", name: { text: "TechFlow" } }, createdAt: "2024-02-01T00:00:00Z" },
];

export const mockProjects = [
  { id: "p1", name: "Acme Corp Website Redesign", identifier: "ACME", description: "Complete redesign of corporate website and marketing pages", network: 0, status: "started", client: "Acme Corp", startDate: "2024-03-01", targetDate: "2024-05-31", totalIssues: 24, completedIssues: 14, members: [{ avatar: null, displayName: "Alex Kim" }, { avatar: null, displayName: "Jordan Lee" }] },
  { id: "p2", name: "TechFlow Mobile App", identifier: "TECH", description: "iOS and Android app development for TechFlow platform", network: 0, status: "started", client: "TechFlow", startDate: "2024-02-15", targetDate: "2024-07-30", totalIssues: 48, completedIssues: 18, members: [{ avatar: null, displayName: "Riley Chen" }, { avatar: null, displayName: "Sam Torres" }] },
  { id: "p3", name: "GrowthCo Analytics Dashboard", identifier: "GROW", description: "Custom analytics dashboard with real-time reporting", network: 0, status: "backlog", client: "GrowthCo", startDate: "2024-04-01", targetDate: "2024-06-30", totalIssues: 16, completedIssues: 0, members: [{ avatar: null, displayName: "Alex Kim" }] },
  { id: "p4", name: "NexaBit Smart Contract Audit", identifier: "NEXA", description: "Security audit for smart contract infrastructure", network: 0, status: "started", client: "NexaBit", startDate: "2024-03-15", targetDate: "2024-05-15", totalIssues: 12, completedIssues: 9, members: [{ avatar: null, displayName: "Jordan Lee" }, { avatar: null, displayName: "Riley Chen" }] },
];

export const mockTasks: Record<string, Task[]> = {
  p1: [
    { id: "t1", name: "Design system setup", description: "Setup Figma design system with brand tokens", priority: "urgent", state: { name: "Done", color: "#22c55e" }, assignees: [{ displayName: "Alex Kim" }], dueDate: "2024-03-15", projectId: "p1" },
    { id: "t2", name: "Homepage hero redesign", description: "New hero section with animated gradients", priority: "high", state: { name: "In Progress", color: "#6366f1" }, assignees: [{ displayName: "Jordan Lee" }], dueDate: "2024-04-20", projectId: "p1" },
    { id: "t3", name: "SEO metadata overhaul", description: "Update all meta tags and structured data", priority: "medium", state: { name: "Todo", color: "#71717a" }, assignees: [{ displayName: "Alex Kim" }], dueDate: "2024-05-01", projectId: "p1" },
    { id: "t4", name: "Mobile responsiveness audit", description: "Full responsive audit across all breakpoints", priority: "high", state: { name: "In Review", color: "#f59e0b" }, assignees: [{ displayName: "Jordan Lee" }], dueDate: "2024-04-25", projectId: "p1" },
  ],
  p2: [
    { id: "t5", name: "Authentication flows", description: "Login, signup, OAuth, password reset screens", priority: "urgent", state: { name: "Done", color: "#22c55e" }, assignees: [{ displayName: "Riley Chen" }], dueDate: "2024-03-20", projectId: "p2" },
    { id: "t6", name: "Dashboard screens", description: "Main dashboard with charts and metrics", priority: "high", state: { name: "In Progress", color: "#6366f1" }, assignees: [{ displayName: "Sam Torres" }], dueDate: "2024-04-30", projectId: "p2" },
    { id: "t7", name: "Push notification system", description: "FCM integration for iOS and Android", priority: "medium", state: { name: "Todo", color: "#71717a" }, assignees: [{ displayName: "Riley Chen" }], dueDate: "2024-05-15", projectId: "p2" },
  ],
  p3: [
    { id: "t8", name: "Data pipeline setup", description: "ETL pipeline for analytics data ingestion", priority: "high", state: { name: "Todo", color: "#71717a" }, assignees: [{ displayName: "Alex Kim" }], dueDate: "2024-04-15", projectId: "p3" },
  ],
  p4: [
    { id: "t9", name: "Static analysis scan", description: "Automated vulnerability scanning", priority: "urgent", state: { name: "Done", color: "#22c55e" }, assignees: [{ displayName: "Jordan Lee" }], dueDate: "2024-03-25", projectId: "p4" },
    { id: "t10", name: "Manual code review", description: "Line-by-line audit of critical functions", priority: "urgent", state: { name: "In Progress", color: "#6366f1" }, assignees: [{ displayName: "Riley Chen" }], dueDate: "2024-04-10", projectId: "p4" },
    { id: "t11", name: "Final audit report", description: "Compile findings into audit report", priority: "high", state: { name: "Todo", color: "#71717a" }, assignees: [{ displayName: "Jordan Lee" }], dueDate: "2024-05-10", projectId: "p4" },
  ],
};

export type Task = {
  id: string;
  name: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low" | "none";
  state: { name: string; color: string };
  assignees: { displayName: string }[];
  dueDate: string;
  projectId: string;
};

export const mockActivities = [
  { id: "a1", entityType: "deal", entityId: "d1", action: "won", actor: "Alex Kim", metadata: { dealName: "Acme Corp Enterprise Plan", amount: "$24,000" }, source: "crm", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "a2", entityType: "project", entityId: "p1", action: "created", actor: "Alex Kim", metadata: { projectName: "Acme Corp Website Redesign" }, source: "project", createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString() },
  { id: "a3", entityType: "task", entityId: "t6", action: "updated", actor: "Sam Torres", metadata: { taskName: "Dashboard screens", status: "In Progress" }, source: "project", createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "a4", entityType: "contact", entityId: "c5", action: "created", actor: "Sam Lee", metadata: { contactName: "Emma Walsh", company: "LaunchPad" }, source: "crm", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "a5", entityType: "deal", entityId: "d2", action: "updated", actor: "Alex Kim", metadata: { dealName: "TechFlow Growth Bundle", stage: "Negotiation" }, source: "crm", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "a6", entityType: "task", entityId: "t4", action: "updated", actor: "Jordan Lee", metadata: { taskName: "Mobile responsiveness audit", status: "In Review" }, source: "project", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
  { id: "a7", entityType: "project", entityId: "p4", action: "updated", actor: "Riley Chen", metadata: { projectName: "NexaBit Smart Contract Audit", progress: "75%" }, source: "project", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "a8", entityType: "deal", entityId: "d3", action: "updated", actor: "Sam Lee", metadata: { dealName: "GrowthCo Marketing Suite", stage: "Proposal Sent" }, source: "crm", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
];

export const mockTeam = [
  { id: "u1", name: "Alex Kim", email: "alex@startupos.com", role: "owner", avatarUrl: null, activeProjects: 3, openTasks: 5 },
  { id: "u2", name: "Sam Lee", email: "sam@startupos.com", role: "sales_manager", avatarUrl: null, activeProjects: 0, openTasks: 2 },
  { id: "u3", name: "Jordan Lee", email: "jordan@startupos.com", role: "project_manager", avatarUrl: null, activeProjects: 2, openTasks: 4 },
  { id: "u4", name: "Riley Chen", email: "riley@startupos.com", role: "member", avatarUrl: null, activeProjects: 2, openTasks: 3 },
  { id: "u5", name: "Sam Torres", email: "storres@startupos.com", role: "member", avatarUrl: null, activeProjects: 1, openTasks: 2 },
];

export const mockNotifications = [
  { id: "n1", type: "deal_won", title: "Deal Won 🎉", body: "Acme Corp Enterprise Plan — $24,000", entityType: "deal", entityId: "d1", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "n2", type: "task_assigned", title: "Task assigned to you", body: "Dashboard screens — TechFlow Mobile App", entityType: "task", entityId: "t6", read: false, createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "n3", type: "project_created", title: "Project created", body: "Acme Corp Website Redesign is now live", entityType: "project", entityId: "p1", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString() },
  { id: "n4", type: "deal_updated", title: "Deal moved to Negotiation", body: "TechFlow Growth Bundle needs attention", entityType: "deal", entityId: "d2", read: true, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
];
