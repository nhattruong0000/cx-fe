# Codebase Summary

Last updated: 2026-04-03

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| UI | shadcn/ui + Tailwind CSS v4 |
| State | TanStack Query v5 + Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts 3 (LineChart, BarChart, PieChart) |
| Auth | Mock JWT + Zustand auth store |
| Deploy | Docker via Coolify on VPS |

## Directory Structure

```
src/
├── app/
│   ├── (auth)/              # Login, forgot-password, invite, reset-password
│   ├── (dashboard)/         # Dashboard route group
│   │   ├── layout.tsx       # Role-driven layout (sidebar vs header-only)
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Route entry, resolves role → view
│   │   │   ├── admin-dashboard.tsx  # Admin view
│   │   │   ├── staff-dashboard.tsx  # Staff view
│   │   │   ├── customer-dashboard.tsx
│   │   │   ├── dashboard-skeleton.tsx
│   │   │   └── dashboard-error.tsx
│   │   └── notifications/
│   │       └── page.tsx (new: Notifications page with tabs, filters, pagination)
│   ├── globals.css
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home redirect
├── components/
│   ├── auth/                # Auth form components
│   ├── dashboard/           # Shared dashboard UI
│   │   ├── stat-card.tsx
│   │   ├── chart-card.tsx
│   │   ├── activity-feed.tsx
│   │   ├── dashboard-header.tsx
│   │   └── user-avatar-button.tsx
│   ├── layout/              # App shell
│   │   ├── dashboard-sidebar.tsx
│   │   ├── sidebar-nav-config.ts
│   │   ├── sidebar-nav-item.tsx
│   │   ├── sidebar-icon-map.ts
│   │   ├── dashboard-top-bar.tsx (modified: added bell icon + notification popover)
│   │   └── notification-popup.tsx (new: popover content with recent notifications)
│   ├── notifications/       # Notification-specific components
│   │   ├── notification-list-item.tsx
│   │   └── notification-page-content.tsx
│   └── ui/                  # shadcn/ui primitives
│       ├── popover.tsx (new: base-ui Popover wrapper)
├── hooks/
│   ├── use-dashboard-summary.ts  # TanStack Query wrapper
│   └── use-notifications.ts (new: notifications query + mutations)
├── lib/
│   ├── api/
│   │   ├── client.ts        # Fetch wrapper with auth headers
│   │   ├── auth.ts          # Auth API calls
│   │   ├── dashboard.ts     # GET /api/v1/dashboard/summary
│   │   └── notifications.ts (new: GET /api/v1/notifications with mock data)
│   ├── dashboard-chart-colors.ts
│   ├── dashboard-icon-map.ts
│   ├── dashboard-table-utils.ts
│   ├── notification-icon-map.ts (new: NotificationType → icon/color mapping)
│   ├── format-relative-time.ts
│   ├── password-strength.ts
│   └── utils.ts
├── middleware.ts             # Route protection (JWT check)
├── providers/               # QueryClient, auth providers
├── stores/
│   └── auth-store.ts        # Zustand: user, role, token
└── types/
    ├── dashboard.ts         # Discriminated union API types
    └── notification.ts (new: Notification, NotificationType, NotificationsResponse)
```

## Key Modules

### Notifications (Real-Time, WebSocket) - NEW

```
ActionCable Consumer Setup
├── lib/action-cable-consumer.ts — Singleton instance with auto-reconnect
├── hooks/use-notification-subscription.ts — Connect to NotificationsChannel
└── Lifecycle: Auto-connect on app mount if authenticated

Notification API & Hooks
├── lib/api/notifications.ts — GET /api/v1/notifications, PATCH read
├── hooks/use-notifications.ts — Query + mutations for notification list
└── hooks/use-notification-subscription.ts — WebSocket real-time updates

Notification Components
├── components/layout/dashboard-top-bar.tsx (modified: bell icon + popover trigger)
├── components/layout/notification-popup.tsx (new: recent notifications preview)
├── components/notifications/notification-list-item.tsx (new: single item UI)
└── components/notifications/notification-page-content.tsx (new: full center with tabs)

Notification Preferences
├── lib/api/notifications.ts — GET/PATCH /api/v1/notification_preferences/:user_id
├── hooks/use-notifications.ts — includes useNotificationPreferences mutation
└── Tab in /notifications page for user to toggle per-event-type preferences

Types
├── types/notification.ts — Notification, NotificationType, NotificationsResponse
└── Exported from: Notification, NotificationPreference, NotificationEvent
```

### WebSocket (ActionCable) - NEW

- `lib/action-cable-consumer.ts`: Singleton ActionCable instance with token refresh on 401
- Auto-reconnect: Attempts 5x with exponential backoff (1s, 2s, 4s, 8s, 16s)
- Token expiry: Client-side error handler triggers Zustand token refresh
- Connection lifecycle: Auto-create on app mount, manual disconnect on logout

### Authentication
- `stores/auth-store.ts`: Zustand store — user object, `role: UserRole`, JWT token
- `middleware.ts`: Protects all `/(dashboard)/*` routes; redirects to `/login` if unauthenticated
- `lib/api/auth.ts`: Login, logout, invite-accept, password reset calls
- `components/auth/auth-left-panel.tsx`: Reusable auth page sidebar (48px padding, featureIcons support)
- `components/auth/password-strength-segment-bar.tsx`: 4-segment password strength indicator
- Auth pages (login, forgot-password, reset-password, invite): Vietnamese localization with Zod validation

### Dashboard (role-based)
Single route `/dashboard`, role resolved client-side:

| Role | Layout | Sidebar |
|------|--------|---------|
| admin | 260px sidebar + header | Full nav |
| staff | 260px sidebar + header | Role-filtered nav |
| customer | Header-only, centered | None |

- `app/(dashboard)/layout.tsx`: Conditionally renders sidebar based on role from auth store
- `app/(dashboard)/dashboard/page.tsx`: Calls `useDashboardSummary()`, switches on `data.role`
- `lib/api/dashboard.ts`: `getDashboardSummary()` — `GET /api/v1/dashboard/summary`
- `hooks/use-dashboard-summary.ts`: staleTime 1min, refetchInterval 5min

### Shared Dashboard Components
- `stat-card.tsx`: KPI card with value, change %, icon
- `chart-card.tsx`: Recharts wrapper (LineChart / BarChart / PieChart)
- `activity-feed.tsx`: List of `ActivityItem` with relative timestamps
- `dashboard-header.tsx`: Top bar with user avatar button
- `user-avatar-button.tsx`: Dropdown trigger showing initials/avatar

### Types (`src/types/dashboard.ts`)
Discriminated union on `role` field:
- `AdminDashboardSummary` — stats, 2 charts, role distribution, recent activity
- `StaffDashboardSummary` — stats, 2 charts, surveys list, tickets list
- `CustomerDashboardSummary` — stats, user name, organization info, team members, surveys

### Utilities
- `dashboard-chart-colors.ts`: Color palette constants for Recharts
- `dashboard-icon-map.ts`: Maps icon name strings → Lucide React components
- `dashboard-table-utils.ts`: Formatters for table cell rendering
- `format-relative-time.ts`: ISO timestamp → "2 hours ago" strings
