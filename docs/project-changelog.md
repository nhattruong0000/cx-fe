# Project Changelog

## [2026-04-27] Forecast V2 Migration (commit 0a3d03c)

- Migrate FE consumers from V1 → V2 inventory endpoints (stock_status, dashboard-summary, suppliers/:id/skus, items/:code/forecast, items/:code/evidence)
- Drop legacy utils/components: `expandV2ToLegacy3Horizon`, `ForecastCiChart`, `forecast-evidence-utils.ts`, `use-forecast-status.ts`, `v1-forecast-adapter.ts`
- Replace 3-horizon UI with `ForecastActionCard` (daily_rate, dus, status_band)
- Switch supplier SKUs columns: `forecast_30d/90d` → `daily_rate, rop, dus, classification`
- Sort top-5 critical by `dus ASC` (was `forecast_30d DESC`)
- Refactor `sku-forecast-evidence-dialog` around evidence bundle (no more CI chart)
- Drop legacy types: `StockLatestForecast`, `ForecastPoint`, `ForecastResponse`; new types in `src/types/inventory.ts`
- Reference: `plans/260427-0903-forecast-v2-full-migration-cleanup/`

## [Unreleased]

### Refactor — 2026-04-21: Inventory Dashboard Summary-Only Redesign

Rewritten `/dashboard/inventory` from 7-section workspace (critical alerts, stock grid, alert donut, forecast, PO pipeline, supplier cadence, SKU detail) to single-glance summary page (3 rows, 9 cards).

**Frontend Changes (cx-fe)**
- `/dashboard/inventory` → 3-row layout: 4 Hero KPIs (row 1), 2 breakdown charts—alerts by type + top suppliers (row 2), 3 Top-10 lists—low stock, overstock, alerts (row 3)
- New component tree under `src/components/_components/summary/`: InventorySummaryKPI, InventorySummaryChart, InventorySummaryTopList
- New API contract: `GET /api/v1/inventory/dashboard-summary` (FE ready, backend TBD) [DEPRECATED 2026-04-27 — V2 active]
- New routes (stubbed): `/inventory/alerts`, `/inventory/sku/[code]`, `/inventory/suppliers/[id]`, `/purchase-orders`
- Vitest unit test framework added for component testing
- 11 legacy inventory workspace files deleted (sections, detail views, SKU modal)

**Architecture decisions**
- Summary page designed for quick glance; drill-down via new routes when ready
- Card layout uses shared `ChartCard` + custom list components for consistency

### Added — 2026-04-19: Domain-Specific Dashboards (Inventory + System)

Split the single `/dashboard` overview into a collapsible sidebar section with 3 children: Tổng quan, Kho & Dự báo, Hệ thống.

**Frontend (cx-fe)**
- `/dashboard/system` (admin only) — AMIS sync status, per-entity sync table, proxy pool health, error rate, user stats
- Sidebar `Dashboard` restructured as collapsible parent (Tổng quan | Kho & Dự báo | Hệ thống)

**Backend (cx-api)**
- `GET /api/v1/ops/sync_status` (admin) — AMIS sync state + proxy pool + circuit-breaker; 30s cache; never exposes raw token
- `GET /api/v1/ops/user_stats` (admin) — total, active_last_24h, pending invites, suspended, role distribution
- `GET /api/v1/inventory/items/stock_status` — batch variant, max 100 `item_codes`, per-row error isolation

**Architecture decisions**
- `Ops::BaseController` centralizes `role_admin?` 403 gate; client-side role check is defense-in-depth, not primary gate
- Batch stock_status reuses `Inventory::StockStatusQuery` per item_code to keep single-item parity

### Added — 2026-04-03: Real-Time Notifications Fullstack (COMPLETE)

Integrated real-time, event-driven notifications with WebSocket (ActionCable) backend connection, UI center with filtering, and notification preferences management.

**Backend Changes (Rails 8)**
- `Notification` model + `notifications` table (user_id, event_type, title, body, data, read_at)
- `NotificationPreference` model + table (user_id, event_type, enabled, weekly_digest)
- `NotificationsController` — GET index, PATCH read, PATCH read_all
- `NotificationPreferencesController` — GET show, PATCH update
- `NotificationsChannel` (ActionCable) — Real-time broadcast per user with JWT auth
- `CreateNotificationsJob` — Event-driven async creation + broadcast
- `CheckSatisfactionThresholdJob` — Hourly low satisfaction detection + notification
- Pundit policies: `NotificationPolicy`, `NotificationPreferencePolicy`
- Event triggers: survey_response, new_user, low_satisfaction, system

**Frontend Changes (React/Next.js)**
- `lib/action-cable-consumer.ts` (new) — Singleton ActionCable instance, auto-reconnect, token refresh
- `hooks/use-notification-subscription.ts` (new) — WebSocket subscription to NotificationsChannel
- `hooks/use-notifications.ts` (new) — Query + mutations (read, read_all, updatePreferences)
- `lib/api/notifications.ts` (new) — GET /api/v1/notifications, PATCH endpoints
- Components:
  - `dashboard-top-bar.tsx` (modified) — Added bell icon + notification popover trigger
  - `notification-popup.tsx` (new) — Popover: recent unread notifications, link to center
  - `notification-list-item.tsx` (new) — Single notification card (title, body, timestamp, read checkbox)
  - `notification-page-content.tsx` (new) — Full center with tabs (All, Unread, Surveys, System, Preferences)
- `types/notification.ts` (new) — Notification, NotificationType, NotificationsResponse, NotificationPreference
- `ui/popover.tsx` (new) — Base-ui Popover wrapper for reusable popovers

**Architecture Decisions**
- ActionCable: Singleton per session, JWT auth per connection, auto-reconnect on token refresh
- Real-time: WebSocket + React Query for optimistic updates
- API: REST for persistence, WebSocket for push notifications
- Preferences: Per-event-type toggles + weekly digest flag stored server-side
- Authorization: Pundit policies prevent cross-user notification access

### Updated — 2026-04-02: Auth Pages Design Sync

4 auth pages (login, forgot-password, reset-password, invite) aligned with design system v2 using Vietnamese localization.

**UI Changes**
- `auth-left-panel.tsx` — padding updated to 48px; `featureIcons` prop added for custom icon rendering
- New component: `password-strength-segment-bar.tsx` — 4-segment strength indicator with Vietnamese labels

**Localization** 
- All 4 auth pages now display content in Vietnamese (error messages, placeholders, labels)
- Zod validation messages updated to Vietnamese

**Architecture decisions**
- Import standardization: all Zod imports use `"zod"` (not `"zod/v4"`)
- PasswordStrengthSegmentBar reusable across reset-password and reset-password form flows
- E2E tests updated to match Vietnamese text expectations

### Added — 2026-03-31: Account & Admin Screens (Profile, Security, User Management, Invite)

4 new pages implementing account settings and admin user management with 8 missing UI components.

**UI Components** (`src/components/ui/`)
- `select.tsx`, `dropdown-menu.tsx`, `tabs.tsx`, `avatar.tsx`, `textarea.tsx`, `radio-group.tsx` — shadcn/ui primitives restyled to design-system-v2 tokens
- `data-table.tsx` — Generic TanStack Table wrapper with search/filter slot
- `pagination.tsx` — "Showing X-Y of Z" + prev/next buttons

**Types** (`src/types/`)
- `profile.ts` — `UpdateProfileRequest`, `ChangePasswordRequest`, `Session`, `TwoFactorStatus`, `NotificationPreference`
- `admin.ts` — `AdminUser`, `AdminUsersResponse`, `AdminUsersParams`, `InviteUserRequest`, `AdminGroup`

**API & Data** (`src/lib/api/`, `src/hooks/`)
- `profile.ts` — getProfile, updateProfile, changePassword, getSessions, revokeSession, revokeAllOtherSessions, get2FAStatus, enable2FA, disable2FA, getNotificationPreferences, updateNotificationPreference
- `admin-users.ts` — getAdminUsers, inviteUser, getAdminGroups
- `use-profile.ts` — useProfile, useUpdateProfile, useChangePassword, useSessions, useRevokeSession, useRevokeAllOtherSessions, use2FAStatus, useNotificationPreferences, useUpdateNotificationPreference
- `use-admin-users.ts` — useAdminUsers, useInviteUser, useAdminGroups

**Account Pages** (`src/app/(dashboard)/`, `src/components/account/`)
- `/profile/page.tsx` — Profile Settings with 3 cards: personal info, change password, notification preferences
- `/profile/page.tsx` consumers — `profile-personal-info-card.tsx`, `profile-change-password-card.tsx`, `profile-notification-preferences-card.tsx`
- `/security/page.tsx` — Security & Sessions with 3 cards: 2FA status, active sessions list, password status
- `/security/page.tsx` consumers — `security-two-factor-card.tsx`, `security-active-sessions-card.tsx`, `security-password-card.tsx`
- `lib/format-relative-time.ts` — Timestamp formatter for sessions

**Admin Pages** (`src/app/(dashboard)/`, `src/components/admin/`)
- `/users/page.tsx` — User Management with search, role/status filters, data table, pagination
- `/users/page.tsx` consumers — `user-management-toolbar.tsx`, `user-management-columns.tsx`, `user-management-table.tsx`
- `/invite/page.tsx` — Invite New User form with email, role RadioCards, permission group select, personal message textarea
- `/invite/page.tsx` consumers — `invite-user-form.tsx`

**Sidebar Navigation**
- Added ACCOUNT section to admin/staff nav config (Profile, Security routes)

**Architecture decisions**
- All 8 missing UI components installed via shadcn CLI, restyled to v2 tokens (#2556C5 primary, #E4E4E7 border, 10px/14px radius)
- Avatar component supports 3 sizes (sm/md/lg); RadioCard variant for invite page role selector
- DataTable generic for any column definition; Pagination client-side managed with server-side params
- API contracts follow REST pattern: /api/v1/users/me, /api/v1/auth/*, /api/v1/admin/*
- TanStack Query staleTime defaults 60s, refetch on window focus
- Browser verification deferred — build passes, visual verification recommended on dev server

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
