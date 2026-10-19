import { formatDistanceToNow, format } from "date-fns";

export function formatCurrency(amountMicros: number, currencyCode = "USD"): string {
  const amount = amountMicros / 1_000_000;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy");
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function dealStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    LEAD: "Lead",
    QUALIFIED: "Qualified",
    DEMO_SCHEDULED: "Demo Scheduled",
    PROPOSAL_SENT: "Proposal Sent",
    NEGOTIATION: "Negotiation",
    WON: "Won",
    LOST: "Lost",
  };
  return labels[stage] || stage;
}

export function projectStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    backlog: "Planning",
    started: "Active",
    paused: "Review",
    completed: "Completed",
    cancelled: "Archived",
  };
  return labels[status] || status;
}

export function priorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    urgent: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
    none: "None",
  };
  return labels[priority] || priority;
}

export function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    sales_manager: "Sales Manager",
    project_manager: "Project Manager",
    member: "Team Member",
    guest: "Guest",
  };
  return labels[role] || role;
}
