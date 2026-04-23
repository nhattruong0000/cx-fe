import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TopRiskySkusList } from "./top-risky-skus-list";
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
    risky_skus: Array.from({ length: count }, (_, i) => ({
      code: `SKU-${String(i + 1).padStart(3, "0")}`,
      name_vi: `Sản phẩm rủi ro ${i + 1}`,
      on_hand: 10 - i,
      days_of_cover: 5 + i * 0.5,
      forecast_30d: 20 + i,
      open_alerts_count: i % 3,
      risk_score: 95 - i * 5,
    })),
    upcoming_or_overdue_pos: [],
    off_cadence_suppliers: [],
  },
});

describe("TopRiskySkusList", () => {
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

      render(<TopRiskySkusList />);

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

      const { container } = render(<TopRiskySkusList />);
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

      render(<TopRiskySkusList />);
      expect(
        screen.getByText("Không tải được dữ liệu.")
      ).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty message when no risky SKUs", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(0),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);
      expect(
        screen.getByText("Không có SKU rủi ro.")
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

      render(<TopRiskySkusList />);
      expect(screen.getByText("Top 10 SKU rủi ro")).toBeInTheDocument();
    });

    it("renders exactly 10 SKU items when data has 10 items", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(10),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);
      const items = screen.getAllByRole("listitem");
      // 10 SKU items + 1 footer "Xem tất cả" is in the Card but not in ul
      expect(items).toHaveLength(10);
    });

    it("renders SKU name and code for each item", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);

      expect(screen.getByText("Sản phẩm rủi ro 1")).toBeInTheDocument();
      expect(screen.getByText("SKU-001")).toBeInTheDocument();
      expect(screen.getByText("Sản phẩm rủi ro 2")).toBeInTheDocument();
      expect(screen.getByText("SKU-002")).toBeInTheDocument();
    });

    it("renders days of cover with urgency formatting", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);
      // First SKU has 5 days (destructive)
      expect(screen.getByText("5 ngày")).toBeInTheDocument();
      // Second SKU has 5.5 days (destructive)
      expect(screen.getByText("6 ngày")).toBeInTheDocument();
    });

    it("renders risk score values", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);
      expect(screen.getByText(/Rủi ro: 95\.0/)).toBeInTheDocument();
      expect(screen.getByText(/Rủi ro: 90\.0/)).toBeInTheDocument();
    });

    it("links each SKU to /inventory/sku/{code}", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopRiskySkusList />);
      const links = container.querySelectorAll("a");

      // First 3 should be SKU links
      expect(links[0]).toHaveAttribute("href", "/inventory/sku/SKU-001");
      expect(links[1]).toHaveAttribute("href", "/inventory/sku/SKU-002");
      expect(links[2]).toHaveAttribute("href", "/inventory/sku/SKU-003");
    });

    it("includes footer link to /inventory", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopRiskySkusList />);
      const links = container.querySelectorAll("a");
      const footerLink = Array.from(links).find(
        (link) => link.getAttribute("href") === "/inventory"
      );
      expect(footerLink).toBeInTheDocument();
      expect(footerLink).toHaveTextContent("Xem tất cả");
    });

    it("applies hover background to list items", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopRiskySkusList />);
      const listItem = container.querySelector("li");
      expect(listItem?.className).toContain("hover:bg-muted/50");
    });

    it("renders list items with border separators", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopRiskySkusList />);
      const ul = container.querySelector("ul");
      expect(ul?.className).toContain("divide-y");
      expect(ul?.className).toContain("divide-border");
    });

    it("uses correct card styling", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopRiskySkusList />);
      const card = container.querySelector('[class*="bg-card"]');
      expect(card?.className).toContain("bg-card");
    });
  });

  describe("data binding", () => {
    it("renders SKU code in correct order (code not name_vi in secondary)", () => {
      const customData = createMockData(2);
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopRiskySkusList />);
      const items = container.querySelectorAll("li");

      // Check first item structure
      const firstItem = items[0];
      expect(firstItem.textContent).toContain("SKU-001");
      expect(firstItem.textContent).toContain("Sản phẩm rủi ro 1");
    });

    it("uses data?.top_lists.risky_skus when data exists", () => {
      const mockData = createMockData(5);
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);

      // Verify we can see data from the 5 items
      expect(screen.getByText("SKU-001")).toBeInTheDocument();
      expect(screen.getByText("SKU-005")).toBeInTheDocument();
    });

    it("defaults to empty array when data is null", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopRiskySkusList />);

      // Should render empty state
      expect(
        screen.getByText("Không có SKU rủi ro.")
      ).toBeInTheDocument();
    });
  });
});
