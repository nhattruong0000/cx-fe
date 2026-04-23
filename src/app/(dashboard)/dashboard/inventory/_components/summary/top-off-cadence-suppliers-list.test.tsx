import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TopOffCadenceSuppliersList } from "./top-off-cadence-suppliers-list";
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
    upcoming_or_overdue_pos: [],
    off_cadence_suppliers: Array.from({ length: count }, (_, i) => ({
      supplier_id: `SUP-${String(i + 1).padStart(3, "0")}`,
      supplier_name: `Nhà cung cấp ${i + 1}`,
      avg_gap_days: 10 + i * 2,
      days_since_last_inward: 5 + i,
      overdue: i % 2 === 0,
    })),
  },
});

describe("TopOffCadenceSuppliersList", () => {
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

      render(<TopOffCadenceSuppliersList />);

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

      const { container } = render(<TopOffCadenceSuppliersList />);
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

      render(<TopOffCadenceSuppliersList />);
      expect(
        screen.getByText("Không tải được dữ liệu.")
      ).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders empty message when no off-cadence suppliers", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(0),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);
      expect(
        screen.getByText("Không có NCC lệch nhịp.")
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

      render(<TopOffCadenceSuppliersList />);
      expect(screen.getByText("Top 10 NCC lệch nhịp")).toBeInTheDocument();
    });

    it("renders exactly 10 supplier items when data has 10 items", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(10),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(10);
    });

    it("renders supplier name for each item", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);

      expect(screen.getByText("Nhà cung cấp 1")).toBeInTheDocument();
      expect(screen.getByText("Nhà cung cấp 2")).toBeInTheDocument();
      expect(screen.getByText("Nhà cung cấp 3")).toBeInTheDocument();
    });

    it("renders average gap days for each supplier", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);

      // Suppliers have avg_gap_days: 10, 12, 14
      expect(screen.getByText("Nhịp trung bình: 10 ngày/lần")).toBeInTheDocument();
      expect(screen.getByText("Nhịp trung bình: 12 ngày/lần")).toBeInTheDocument();
      expect(screen.getByText("Nhịp trung bình: 14 ngày/lần")).toBeInTheDocument();
    });

    it("renders overdue/off-cadence status labels", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);

      // First supplier (index 0) is overdue (i % 2 === 0)
      const overdueLabels = screen.getAllByText("Quá hạn");
      expect(overdueLabels.length).toBeGreaterThanOrEqual(1);
      // Second supplier (index 1) is off-cadence
      const offCadenceLabels = screen.getAllByText("Lệch nhịp");
      expect(offCadenceLabels.length).toBeGreaterThanOrEqual(1);
    });

    it("renders days since last inward", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);

      // days_since_last_inward: 5, 6, 7
      expect(screen.getByText("5 ngày chưa nhập")).toBeInTheDocument();
      expect(screen.getByText("6 ngày chưa nhập")).toBeInTheDocument();
      expect(screen.getByText("7 ngày chưa nhập")).toBeInTheDocument();
    });

    it("links each supplier to /inventory/suppliers/{id}", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const links = container.querySelectorAll("a");

      // First 3 should be supplier links
      expect(links[0]).toHaveAttribute(
        "href",
        "/inventory/suppliers/SUP-001"
      );
      expect(links[1]).toHaveAttribute(
        "href",
        "/inventory/suppliers/SUP-002"
      );
      expect(links[2]).toHaveAttribute(
        "href",
        "/inventory/suppliers/SUP-003"
      );
    });

    it("includes footer link to /inventory/suppliers", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const links = container.querySelectorAll("a");
      const footerLink = Array.from(links).find(
        (link) =>
          link.getAttribute("href") === "/inventory/suppliers" &&
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

      const { container } = render(<TopOffCadenceSuppliersList />);
      const destructiveElements = container.querySelectorAll(
        "p.text-destructive"
      );
      expect(destructiveElements.length).toBeGreaterThan(0);
      expect(destructiveElements[0].textContent).toBe("Quá hạn");
    });

    it("applies yellow styling to off-cadence status", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(2),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const yellowElements = container.querySelectorAll(
        "p.text-yellow-600"
      );
      expect(yellowElements.length).toBeGreaterThan(0);
      expect(yellowElements[0].textContent).toBe("Lệch nhịp");
    });

    it("applies hover background to list items", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const listItem = container.querySelector("li");
      expect(listItem?.className).toContain("hover:bg-muted/50");
    });

    it("renders list items with border separators", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(3),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const ul = container.querySelector("ul");
      expect(ul?.className).toContain("divide-y");
      expect(ul?.className).toContain("divide-border");
    });
  });

  describe("data binding", () => {
    it("uses data?.top_lists.off_cadence_suppliers when data exists", () => {
      const mockData = createMockData(5);
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: mockData,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);

      expect(screen.getByText("Nhà cung cấp 1")).toBeInTheDocument();
      expect(screen.getByText("Nhà cung cấp 5")).toBeInTheDocument();
    });

    it("defaults to empty array when data is null", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
      } as any);

      render(<TopOffCadenceSuppliersList />);

      expect(
        screen.getByText("Không có NCC lệch nhịp.")
      ).toBeInTheDocument();
    });

    it("displays supplier_id in link href, not supplier_name", () => {
      const customData = createMockData(1);
      customData.top_lists.off_cadence_suppliers[0].supplier_id = "ABC-123";
      customData.top_lists.off_cadence_suppliers[0].supplier_name = "Name with spaces";
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const link = container.querySelector("a") as HTMLAnchorElement;
      expect(link.href).toContain("/inventory/suppliers/ABC-123");
      expect(screen.getByText("Name with spaces")).toBeInTheDocument();
    });
  });

  describe("conditional rendering based on overdue flag", () => {
    it("renders correct status based on overdue boolean", () => {
      const customData = createMockData(2);
      customData.top_lists.off_cadence_suppliers[0].overdue = true;
      customData.top_lists.off_cadence_suppliers[1].overdue = false;
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: customData,
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const statusTexts = container.querySelectorAll(
        "p.text-destructive, p.text-yellow-600"
      );
      expect(statusTexts[0].textContent).toBe("Quá hạn");
      expect(statusTexts[1].textContent).toBe("Lệch nhịp");
    });

    it("applies correct font-semibold to overdue status", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const overdueStatus = container.querySelector(
        "p.font-semibold.text-destructive"
      );
      expect(overdueStatus).toBeInTheDocument();
      expect(overdueStatus?.textContent).toBe("Quá hạn");
    });
  });

  describe("card styling", () => {
    it("uses correct card styling classes", () => {
      mockUseInventoryDashboardSummary.mockReturnValue({
        data: createMockData(1),
        isLoading: false,
        isError: false,
      } as any);

      const { container } = render(<TopOffCadenceSuppliersList />);
      const card = container.querySelector('[class*="bg-card"]');
      expect(card?.className).toContain("bg-card");
    });
  });
});
