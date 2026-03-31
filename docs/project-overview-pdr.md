# CX Frontend App — Project Overview

## Mô tả dự án

Dashboard quản trị Customer Experience (CX) cho doanh nghiệp e-commerce/retail. Cho phép nhân viên CSKH và quản lý theo dõi, phân tích trải nghiệm khách hàng qua nhiều kênh.

**Tech stack:** Next.js 15 (App Router, React 19) + shadcn/ui + Tailwind CSS v4 + TanStack Query + Recharts + React Hook Form + Zod. Mock API layer (Rails API đang build song song). Deploy Docker via Coolify trên VPS.

## Status

- **Role-Based Dashboard**: Complete (2026-03-31) — single `/dashboard` route, role-driven views for admin/staff/customer, Recharts 3 charts, sidebar layout

## 4 Module chính

### 1. Survey & Feedback (Khảo sát)

- Quản lý khảo sát CSAT / CES / NPS
- Tạo/sửa khảo sát (tiêu đề, loại, câu hỏi, trigger point)
- Danh sách khảo sát với filter (loại, trạng thái, khoảng thời gian), phân trang
- Trang chi tiết: biểu đồ trend điểm số (Recharts LineChart), danh sách response kèm comment (sanitized)

### 2. Live Chat (Hộp thoại CSKH)

- Inbox cho agent: danh sách hội thoại + filter trạng thái + đếm chưa đọc
- Cửa sổ chat: hiển thị tin nhắn (customer bên trái, agent bên phải), gửi tin nhắn (Ctrl+Enter)
- Quản lý ticket: gán agent, đổi trạng thái (open → assigned → in_progress → resolved → closed)
- Toggle trạng thái agent (available / busy / offline)
- Chỉ CRUD, không real-time — sẽ thêm WebSocket khi Rails API sẵn sàng

### 3. Analytics Dashboard (Phân tích)

- 6 KPI cards: NPS score, CSAT trung bình, tỷ lệ phản hồi, thời gian giải quyết TB, lượng chat, loyalty engagement
- Biểu đồ: NPS trend (line), CSAT theo kênh (bar), tỷ lệ phản hồi (area)
- Loyalty overview: tổng thành viên, phân bố tier Bronze/Silver/Gold (pie chart)
- Date range picker filter toàn bộ dữ liệu đồng thời

### 4. Customer Journey (Hành trình khách hàng)

- Funnel visualization 5 giai đoạn: Awareness → Consideration → Decision → Purchase → Retention
- Tỷ lệ drop-off giữa các giai đoạn
- Stats: thời gian TB đến mua hàng, giai đoạn drop-off lớn nhất, tỷ lệ mua lại

## Tính năng chung

- **App Shell**: Sidebar navigation co/giãn, header (search + notification + user menu), breadcrumb, responsive (sidebar → sheet trên mobile)
- **Auth**: Mock JWT, middleware bảo vệ route, redirect về /login nếu chưa đăng nhập
- **Mock API**: Dữ liệu giả với delay 200-500ms, toggle mock/real qua env var
- **Error handling**: QueryBoundary wrapper (loading skeleton / error retry / empty state)
- **Security**: DOMPurify sanitize mọi nội dung user-generated
- **Home Dashboard**: Trang tổng quan với summary cards link đến từng module

## Ngoài scope

- Không real-time (Socket.io/Redis)
- Không widget cho customer (survey popup, chat widget) — project riêng
- Không loyalty CRUD đầy đủ — chỉ hiển thị stats
- Không dark mode, không AI chatbot, không cross-module event bus
