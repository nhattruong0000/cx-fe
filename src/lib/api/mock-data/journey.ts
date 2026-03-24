import type { FunnelStage, JourneyEvent, JourneyStats } from "@/types/journey";

export const mockJourneyEvents: JourneyEvent[] = [
  { id: "evt-001", userId: "usr-101", customerName: "Nguyễn Văn An", type: "page_view", description: "Xem trang sản phẩm Áo Polo", metadata: { productId: "prod-001", page: "/products/ao-polo" }, createdAt: "2026-03-23T08:00:00Z" },
  { id: "evt-002", userId: "usr-101", customerName: "Nguyễn Văn An", type: "add_to_cart", description: "Thêm Áo Polo vào giỏ hàng", metadata: { productId: "prod-001", quantity: "2" }, createdAt: "2026-03-23T08:05:00Z" },
  { id: "evt-003", userId: "usr-101", customerName: "Nguyễn Văn An", type: "purchase", description: "Mua đơn hàng #1250 - 850.000đ", metadata: { orderId: "1250", amount: "850000" }, createdAt: "2026-03-23T08:10:00Z" },
  { id: "evt-004", userId: "usr-102", customerName: "Trần Thị Bình", type: "page_view", description: "Xem danh mục Giày thể thao", metadata: { page: "/category/giay-the-thao" }, createdAt: "2026-03-23T09:00:00Z" },
  { id: "evt-005", userId: "usr-102", customerName: "Trần Thị Bình", type: "support_ticket", description: "Mở ticket hỏi về đổi trả size", metadata: { ticketId: "conv-002" }, createdAt: "2026-03-23T10:00:00Z" },
  { id: "evt-006", userId: "usr-103", customerName: "Lê Minh Châu", type: "account_created", description: "Đăng ký tài khoản mới", createdAt: "2026-03-22T14:00:00Z" },
  { id: "evt-007", userId: "usr-103", customerName: "Lê Minh Châu", type: "page_view", description: "Xem trang khuyến mãi", metadata: { page: "/promotions" }, createdAt: "2026-03-22T14:05:00Z" },
  { id: "evt-008", userId: "usr-104", customerName: "Phạm Đức Dũng", type: "loyalty_redeem", description: "Đổi 500 điểm lấy voucher 50.000đ", metadata: { points: "500", voucherId: "voucher-100" }, createdAt: "2026-03-22T16:00:00Z" },
  { id: "evt-009", userId: "usr-105", customerName: "Hoàng Thị Em", type: "survey_response", description: "Hoàn thành khảo sát NPS - Điểm 10", metadata: { surveyId: "srv-001", score: "10" }, createdAt: "2026-03-21T09:00:00Z" },
  { id: "evt-010", userId: "usr-105", customerName: "Hoàng Thị Em", type: "purchase", description: "Mua đơn hàng #1248 - 1.200.000đ", metadata: { orderId: "1248", amount: "1200000" }, createdAt: "2026-03-21T10:00:00Z" },
  { id: "evt-011", userId: "usr-106", customerName: "Võ Văn Phúc", type: "product_review", description: "Đánh giá Giày chạy bộ - 4 sao", metadata: { productId: "prod-015", rating: "4" }, createdAt: "2026-03-20T11:00:00Z" },
  { id: "evt-012", userId: "usr-107", customerName: "Đỗ Thị Giang", type: "add_to_cart", description: "Thêm Túi xách vào giỏ hàng", metadata: { productId: "prod-022", quantity: "1" }, createdAt: "2026-03-20T15:00:00Z" },
  { id: "evt-013", userId: "usr-108", customerName: "Bùi Hữu Hải", type: "purchase", description: "Mua đơn hàng #1245 - 2.500.000đ", metadata: { orderId: "1245", amount: "2500000" }, createdAt: "2026-03-19T12:00:00Z" },
  { id: "evt-014", userId: "usr-109", customerName: "Ngô Thị Inh", type: "page_view", description: "Xem sản phẩm Váy liền", metadata: { productId: "prod-030", page: "/products/vay-lien" }, createdAt: "2026-03-19T14:00:00Z" },
  { id: "evt-015", userId: "usr-110", customerName: "Lý Văn Khánh", type: "loyalty_redeem", description: "Đổi 1000 điểm lấy voucher 100.000đ", metadata: { points: "1000", voucherId: "voucher-200" }, createdAt: "2026-03-18T09:00:00Z" },
];

export const mockFunnelStages: FunnelStage[] = [
  { name: "Xem trang", count: 12500, conversionRate: 100 },
  { name: "Thêm giỏ hàng", count: 3750, conversionRate: 30 },
  { name: "Bắt đầu thanh toán", count: 2250, conversionRate: 60 },
  { name: "Hoàn tất mua hàng", count: 1500, conversionRate: 66.7 },
  { name: "Đánh giá sản phẩm", count: 450, conversionRate: 30 },
];

export const mockJourneyStats: JourneyStats = {
  totalEvents: 45230,
  uniqueCustomers: 2500,
  avgEventsPerCustomer: 18.1,
  topEventType: "page_view",
  conversionRate: 12,
};
