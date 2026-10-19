export type UserRole =
  | "owner"
  | "admin"
  | "sales_manager"
  | "project_manager"
  | "member"
  | "guest";

export type DealStage =
  | "LEAD"
  | "QUALIFIED"
  | "DEMO_SCHEDULED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export type TaskPriority = "urgent" | "high" | "medium" | "low" | "none";

export type ProjectStatus = "backlog" | "started" | "paused" | "completed" | "cancelled";

export interface Contact {
  id: string;
  name: { firstName: string; lastName: string };
  email: string;
  phone?: string;
  jobTitle?: string;
  company?: { id: string; name: string };
  createdAt: string;
}

export interface Company {
  id: string;
  name: { text: string };
  domainName?: { primaryLinkUrl: string };
  industryCategory?: string;
  employees?: number;
  createdAt: string;
}

export interface Deal {
  id: string;
  name: string;
  stage: DealStage;
  amount?: { amountMicros: number; currencyCode: string };
  closeDate?: string;
  assignee?: { name: { firstName: string; lastName: string } };
  company?: { id: string; name: { text: string } };
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  identifier: string;
  description?: string;
  status: ProjectStatus;
  client?: string;
  startDate?: string;
  targetDate?: string;
  totalIssues: number;
  completedIssues: number;
  members?: { avatar: string | null; displayName: string }[];
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: TaskPriority;
  state: { name: string; color: string };
  assignees?: { displayName: string }[];
  dueDate?: string;
  projectId: string;
}

export interface Activity {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string;
  metadata: Record<string, string>;
  source: "crm" | "project" | "system";
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  entityType: string;
  entityId: string;
  read: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  activeProjects: number;
  openTasks: number;
}
