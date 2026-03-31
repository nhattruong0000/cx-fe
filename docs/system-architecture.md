# System Architecture

Last updated: 2026-03-31

## Overview

Next.js 15 App Router SPA with mock API layer. Rails API built in parallel; toggled via env var. Auth is mock JWT stored in Zustand. All dashboard data flows through a single API endpoint with role-filtered responses.

## Route Groups

```
app/
├── (auth)/        # Public: /login, /forgot-password, /invite, /reset-password
└── (dashboard)/   # Protected by middleware: /dashboard, future module routes
```

`middleware.ts` intercepts all `/(dashboard)/*` requests — checks JWT in auth store (localStorage), redirects to `/login` if absent.

## Dashboard Data Flow

```
auth-store (Zustand)
    │  role: "admin" | "staff" | "customer"
    │  token: string
    ▼
useDashboardSummary() [TanStack Query]
    │  queryKey: ["dashboard-summary"]
    │  staleTime: 60s, refetchInterval: 300s
    ▼
getDashboardSummary() [lib/api/dashboard.ts]
    │  GET /api/v1/dashboard/summary
    │  Authorization: Bearer {token}
    ▼
DashboardSummary (discriminated union)
    │  { role: "admin" | "staff" | "customer", ...roleData }
    ▼
app/(dashboard)/dashboard/page.tsx
    │  switch(data.role)
    ├── AdminDashboard
    ├── StaffDashboard
    └── CustomerDashboard
```

## Layout Architecture

```
app/(dashboard)/layout.tsx
    │
    ├── role === "admin" | "staff"
    │   ├── DashboardSidebar (260px fixed)
    │   │   ├── sidebar-nav-config.ts  (role-filtered nav items)
    │   │   └── SidebarNavItem[]
    │   └── <main> content area
    │
    └── role === "customer"
        └── DashboardHeader (full-width) + centered <main>
```

`sidebar-nav-config.ts` exports nav items per role. `sidebar-icon-map.ts` maps icon name strings to Lucide components (avoids importing all icons).

## Component Hierarchy (Dashboard)

```
page.tsx
├── DashboardSkeleton        (loading state)
├── DashboardError           (error state + retry)
├── AdminDashboard
│   ├── DashboardHeader
│   ├── StatCard[]           (KPI grid)
│   ├── ChartCard (LineChart)
│   ├── ChartCard (BarChart)
│   ├── ChartCard (PieChart) — role distribution
│   └── ActivityFeed
├── StaffDashboard
│   ├── DashboardHeader
│   ├── StatCard[]
│   ├── ChartCard (LineChart)
│   ├── ChartCard (BarChart)
│   └── tables: surveys, tickets
└── CustomerDashboard
    ├── DashboardHeader
    ├── StatCard[]
    ├── organization info card
    ├── team members list
    └── surveys table
```

## API Layer

| File | Responsibility |
|------|---------------|
| `lib/api/client.ts` | Fetch wrapper — injects auth header, handles errors |
| `lib/api/auth.ts` | Login, logout, invite-accept, password reset |
| `lib/api/dashboard.ts` | `getDashboardSummary(): Promise<DashboardSummary>` |

Mock vs real API toggled via env var (see `.env.example`).

## State Management

| Store | Technology | Contents |
|-------|-----------|----------|
| Auth | Zustand (`auth-store.ts`) | user, role, token, setUser, logout |
| Server state | TanStack Query | Dashboard summary, auth responses |

No global client state beyond auth. Each page manages its own server state via TanStack Query hooks.

## Type Safety

`src/types/dashboard.ts` defines a discriminated union `DashboardSummary` on the `role` field. TypeScript narrows to the correct shape inside each role-specific component after the `switch(data.role)` in `page.tsx`.

## Security

- Route protection: `middleware.ts` blocks unauthenticated access to dashboard routes
- Auth token stored in Zustand (in-memory); persistence strategy TBD when real auth ships
- All user-generated content passed through DOMPurify before render
