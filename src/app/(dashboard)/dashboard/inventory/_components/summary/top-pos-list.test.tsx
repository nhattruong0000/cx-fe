import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TopPosList } from "./top-pos-list";
import { useInventoryDashboardSummary } from "../../_hooks/use-inventory-dashboard-summary";
import type { InventoryDashboardSummary } from "../../_types/dashboard-summary";

vi.mock("../../_hooks/use-inventory-dashboard-summary");

const mockUseInventoryDashboardSummary =
  useInventoryDashboardSummary as ReturnType<typeof vi.fn>;

const createMockData = (count: number = 10): InventoryDashboardSummary => ({
  generated_at: "2025-04-21T14:30:00Z",
  hero_kpis: {
    open_alerts_sku_count: 5,
    critical_alerts_count: 2,
    overdue_po_count: 1,
    reorder_needed_pct: 25,
  },
  breakdown: {
    alerts_by_type: [],
    stock_health: { healthy: 80, low: 15, out: 5 },
  },
  top_lists: {
    risky_skus: [],
    upcoming_or_overdue_pos: Array.from({ length: count }, (_, i) => ({
      po_id: `PO-${String(i + 1).padStart(3, "0")}`,
      po_number: `PO-${String(2025000 + i + 1).padStart(6, "0")}`,
      supplier_name: `Nhà cung cấp ${i + 1}`,
      eta: new Date(2025, 3, 21 + i).toISOString(),
      status: i % 2 === 0 ? "overdue" : "upcoming",
      days_drift: i % 2 === 0 ? i + 1 : -(i + 1),
    })),
    off_cadence_suppliers: [],
  },
});

describe("TopPosList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading state", () => {
    it("renders loading skeleton when data is loading", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as any);

      render(<TopPosList />);

      const skeletons = screen.getAllByRole("generic");
      expect(
        skeletons.some((el) => el.className.includes("animate-pulse"))
      ).toBe(true);
    });

    it("renders 5 skeleton items during loading", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(5);
    });
  });

  describe("error state", () => {
    it("renders error message when fetch fails", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
      } as any);

      render(<TopPosList />);
      expect(
        screen.getByText("Không tải được dữ liệu.")
      ).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty message when no POs", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(0),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);
      expect(
        screen.getByText("Không có PO sắp / quá hạn.")
      ).toBeInTheDocument();
    });
  });

  describe("success state with data", () => {
    it("renders card header with title", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);
      expect(screen.getByText("Top 10 PO sắp / quá hạn")).toBeInTheDocument();
    });

    it("renders exactly 10 PO items when data has 10 items", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(10),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(10);
    });

    it("renders PO number and supplier name for each item", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);

      expect(screen.getByText("PO-2025001")).toBeInTheDocument();
      expect(screen.getByText("Nhà cung cấp 1")).toBeInTheDocument();
      expect(screen.getByText("PO-2025002")).toBeInTheDocument();
      expect(screen.getByText("Nhà cung cấp 2")).toBeInTheDocument();
    });

    it("renders PO status labels correctly", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);
      // First PO (index 0) is overdue, second (index 1) is upcoming, third (index 2) is overdue
      const overdueLabels = screen.getAllByText("Quá hạn");
      const upcomingLabels = screen.getAllByText("Sắp đến");
      expect(overdueLabels.length).toBeGreaterThanOrEqual(1);
      expect(upcomingLabels.length).toBeGreaterThanOrEqual(1);
    });

    it("renders days drift with correct formatting", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);
      // First PO: overdue, days_drift = 1 → "Trễ 1 ngày"
      expect(screen.getByText("Trễ 1 ngày")).toBeInTheDocument();
      // Second PO: upcoming, days_drift = -2 → "Còn 2 ngày"
      expect(screen.getByText("Còn 2 ngày")).toBeInTheDocument();
    });

    it("links all PO items to /purchase-orders", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      const links = container.querySelectorAll("a");

      // First 3 should all link to /purchase-orders
      expect(links[0]).toHaveAttribute("href", "/purchase-orders");
      expect(links[1]).toHaveAttribute("href", "/purchase-orders");
      expect(links[2]).toHaveAttribute("href", "/purchase-orders");
    });

    it("includes footer link to /purchase-orders", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      const links = container.querySelectorAll("a");
      const footerLink = Array.from(links).find(
        (link) =>
          link.getAttribute("href") === "/purchase-orders" &&
          link.textContent.includes("Xem tất cả")
      );
      expect(footerLink).toBeInTheDocument();
    });

    it("applies destructive styling to overdue status", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      const destructiveElements = container.querySelectorAll(
        "p.text-destructive"
      );
      expect(destructiveElements.length).toBeGreaterThan(0);
    });

    it("applies hover background to list items", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      const listItem = container.querySelector("li");
      expect(listItem?.className).toContain("hover:bg-muted/50");
    });

    it("renders list items with border separators", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      const ul = container.querySelector("ul");
      expect(ul?.className).toContain("divide-y");
      expect(ul?.className).toContain("divide-border");
    });
  });

  describe("data binding", () => {
    it("uses data?.top_lists.upcoming_or_overdue_pos when data exists", () => {
      const mockData = createMockData(5);
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);

      expect(screen.getByText("PO-2025001")).toBeInTheDocument();
      expect(screen.getByText("PO-2025005")).toBeInTheDocument();
    });

    it("defaults to empty array when data is null", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);

      expect(
        screen.getByText("Không có PO sắp / quá hạn.")
      ).toBeInTheDocument();
    });

    it("displays supplier name from data", () => {
      const customData = createMockData(1);
      customData.top_lists.upcoming_or_overdue_pos[0].supplier_name =
        "Công ty ABC";
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopPosList />);
      expect(screen.getByText("Công ty ABC")).toBeInTheDocument();
    });
  });

  describe("status styling", () => {
    it("applies font-semibold to overdue status", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      // First item is overdue (index 0, i % 2 === 0)
      const overdueStatus = container.querySelector(
        "p.font-semibold.text-destructive"
      );
      expect(overdueStatus).toBeInTheDocument();
      expect(overdueStatus?.textContent).toBe("Quá hạn");
    });

    it("applies text-foreground to upcoming status", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopPosList />);
      // Second item is upcoming (index 1)
      const upcomingStatuses = Array.from(
        container.querySelectorAll("p.text-foreground")
      );
      const upcomingStatus = upcomingStatuses.find(
        (el) => el.textContent === "Sắp đến"
      );
      expect(upcomingStatus).toBeInTheDocument();
    });
  });
});
