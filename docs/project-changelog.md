# Project Changelog

## [Unreleased]

### Added — 2026-03-31: Role-Based Dashboard

22 new files implementing a single `/dashboard` route with role-driven views.

**Types**
- `src/types/dashboard.ts` — discriminated union `DashboardSummary` (admin | staff | customer) with shared sub-types: `StatItem`, `ChartDataPoint`, `ActivityItem`, `RoleDistribution`, `SurveyRow`, `TeamMember`, `OrganizationInfo`

**API & Data**
- `src/lib/api/dashboard.ts` — `getDashboardSummary()` calling `GET /api/v1/dashboard/summary`
- `src/hooks/use-dashboard-summary.ts` — TanStack Query wrapper (staleTime 60s, refetchInterval 300s)

**Shared Dashboard Components** (`src/components/dashboard/`)
- `stat-card.tsx` — KPI card: value, change %, Lucide icon
- `chart-card.tsx` — Recharts wrapper supporting LineChart, BarChart, PieChart
- `activity-feed.tsx` — Activity list with relative timestamps
- `dashboard-header.tsx` — Top bar component
- `user-avatar-button.tsx` — Avatar dropdown trigger

**Layout Components** (`src/components/layout/`)
- `dashboard-sidebar.tsx` — 260px fixed sidebar for admin/staff
- `sidebar-nav-config.ts` — Role-filtered nav item definitions
- `sidebar-nav-item.tsx` — Individual nav item with active state
- `sidebar-icon-map.ts` — Icon name string → Lucide component map

**Routes** (`src/app/(dashboard)/`)
- `layout.tsx` — Conditional layout: sidebar (admin/staff) vs header-only (customer)
- `dashboard/page.tsx` — Calls `useDashboardSummary()`, switches on `data.role`
- `dashboard/admin-dashboard.tsx` — Stats + 3 charts + activity feed
- `dashboard/staff-dashboard.tsx` — Stats + 2 charts + surveys/tickets tables
- `dashboard/customer-dashboard.tsx` — Stats + org info + team members + surveys
- `dashboard/dashboard-skeleton.tsx` — Loading skeleton
- `dashboard/dashboard-error.tsx` — Error state with retry

**Utilities** (`src/lib/`)
- `format-relative-time.ts` — ISO timestamp → relative string
- `dashboard-chart-colors.ts` — Recharts color palette constants
- `dashboard-icon-map.ts` — Stat icon name → Lucide component
- `dashboard-table-utils.ts` — Table cell formatters

**Architecture decisions**
- Single route, role resolved client-side from Zustand auth store
- Customer layout omits sidebar entirely (header-only, centered content)
- One API endpoint returns role-filtered shape; TypeScript discriminated union ensures type safety
