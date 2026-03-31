# Development Roadmap

Last updated: 2026-03-31

## Status Legend

| Symbol | Meaning |
|--------|---------|
| [x] | Complete |
| [-] | In progress |
| [ ] | Not started |

---

## Phase 1 — Foundation

- [x] Project setup: Next.js 15 + shadcn/ui + Tailwind CSS v4
- [x] Design system: Be Vietnam Pro font, color tokens, component library
- [x] Auth shell: login, forgot-password, invite-accept, reset-password routes
- [x] Mock API client with toggle (mock/real via env var)
- [x] Route protection via middleware (JWT check → redirect to /login)
- [x] Zustand auth store (user, role, token)

## Phase 2 — Role-Based Dashboard

- [x] Single `/dashboard` route with role-driven rendering
- [x] Admin dashboard: KPI stats, survey response chart, tickets by category, role distribution donut, activity feed
- [x] Staff dashboard: KPI stats, response trends chart, tickets by status chart, surveys/tickets tables
- [x] Customer dashboard: stats, organization info, team members, surveys list
- [x] Shared components: StatCard, ChartCard, ActivityFeed, DashboardHeader, UserAvatarButton
- [x] Sidebar layout (admin/staff) with role-filtered nav; header-only layout (customer)
- [x] Loading skeleton and error state with retry
- [x] TanStack Query data fetching with stale/refetch intervals

## Phase 3 — Core Modules (Planned)

- [ ] Survey & Feedback module (CSAT/CES/NPS management)
- [ ] Live Chat / Ticket inbox
- [ ] Analytics dashboard (NPS trend, CSAT by channel, loyalty overview)
- [ ] Customer Journey funnel visualization

## Phase 4 — Real API Integration (Planned)

- [ ] Switch from mock to Rails API (env var toggle)
- [ ] Real JWT auth (replace mock tokens)
- [ ] WebSocket for live chat (when Rails API ready)

## Phase 5 — Polish & Deploy (Planned)

- [ ] Responsive sidebar → sheet on mobile
- [ ] Error boundary and empty state coverage
- [ ] Docker build + Coolify deploy configuration
- [ ] E2E test coverage for critical flows

---

## Out of Scope (Permanent)

- Real-time features via Socket.io/Redis (until Phase 4)
- Customer-facing widgets (survey popup, chat widget) — separate project
- Full loyalty CRUD — display only
- Dark mode
- AI chatbot
- Cross-module event bus
