# merge (CRM + project & task workspace)

Merge is a single workspace for customer relationships and delivery: companies,
contacts, deals, projects, tasks, roadmaps, activity and team management. Think
“CRM + work OS” in one Next.js app.

## Modules

| Area | Routes |
| --- | --- |
| Dashboard | `/dashboard` |
| CRM | `/crm/companies`, `/crm/contacts`, `/crm/deals` (+ detail pages) |
| Customers | `/customers/[companyId]` |
| Work | `/work/projects`, `/work/tasks`, `/work/roadmaps` |
| Activity | `/activity` |
| Team & settings | `/team`, `/settings` |

## Features

- Credentials-based auth with NextAuth (JWT sessions).
- Role-aware navigation and protected `(app)` route group.
- Drag-and-drop kanban/task views (`@dnd-kit`), charts (`recharts`),
  command palette (`cmdk`), date handling (`date-fns`).
- REST route handlers under `src/app/api/` for companies, contacts, deals,
  projects, tasks, activity, notifications and global search.
- Deal-won automation hook (`/api/automation/deal-won`).

## Stack

Next.js 15 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4,
shadcn/Base UI + Radix, NextAuth 5, GraphQL Request, bcryptjs, recharts.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000> → redirects to `/login` or `/dashboard`.

```bash
npm run build
npm start
npm run lint
```

## Configuration

Copy the example env if present (`.env.local`) and set `AUTH_SECRET` plus your
data source. `.env.local` is git-ignored.
