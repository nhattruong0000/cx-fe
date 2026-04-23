import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { KpiTooltipContent } from "./kpi-tooltip-content";

describe("KpiTooltipContent", () => {
  describe("open_alerts_sku metric", () => {
    it("renders correct title and formula", () => {
      render(<KpiTooltipContent metric="open_alerts_sku" />);
      expect(screen.getByText("SKU có cảnh báo mở")).toBeInTheDocument();
      expect(
        screen.getByText("Số lượng SKU có ít nhất 1 cảnh báo chưa xử lý")
      ).toBeInTheDocument();
    });

    it("renders note about alert levels", () => {
      render(<KpiTooltipContent metric="open_alerts_sku" />);
      expect(
        screen.getByText("Bao gồm mọi mức độ (info → critical)")
      ).toBeInTheDocument();
    });

    it("renders with correct CSS classes", () => {
      const { container } = render(
        <KpiTooltipContent metric="open_alerts_sku" />
      );
      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("max-w-[220px]", "space-y-1", "text-xs");
    });
  });

  describe("critical_alerts metric", () => {
    it("renders correct title and formula", () => {
      render(<KpiTooltipContent metric="critical_alerts" />);
      expect(screen.getByText("Cảnh báo nghiêm trọng")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Tổng cảnh báo có severity = critical đang mở"
        )
      ).toBeInTheDocument();
    });

    it("renders note about stockout prevention", () => {
      render(<KpiTooltipContent metric="critical_alerts" />);
      expect(
        screen.getByText("Cần xử lý ngay để tránh stockout")
      ).toBeInTheDocument();
    });
  });

  describe("overdue_po metric", () => {
    it("renders correct title and formula", () => {
      render(<KpiTooltipContent metric="overdue_po" />);
      expect(screen.getByText("PO quá hạn")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Số lượng PO có ETA < hôm nay và chưa nhận hàng"
        )
      ).toBeInTheDocument();
    });

    it("does not render note (formula is self-explanatory)", () => {
      const { container } = render(
        <KpiTooltipContent metric="overdue_po" />
      );
      const italics = container.querySelectorAll("p.italic");
      expect(italics).toHaveLength(0);
    });
  });

  describe("reorder_pct metric", () => {
    it("renders correct title and formula", () => {
      render(<KpiTooltipContent metric="reorder_pct" />);
      expect(screen.getByText("% SKU cần reorder")).toBeInTheDocument();
      expect(
        screen.getByText("SKU cần reorder / Tổng SKU × 100")
      ).toBeInTheDocument();
    });

    it("renders detailed note about reorder criteria", () => {
      render(<KpiTooltipContent metric="reorder_pct" />);
      expect(
        screen.getByText(
          "SKU cần reorder = DoC < 14 ngày hoặc tồn kho ≤ reorder point"
        )
      ).toBeInTheDocument();
    });
  });

  describe("typography and styling", () => {
    it("applies semibold font to title", () => {
      const { container } = render(
        <KpiTooltipContent metric="open_alerts_sku" />
      );
      const title = container.querySelector("p.font-semibold");
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe("SKU có cảnh báo mở");
    });

    it("applies muted-foreground to formula text", () => {
      const { container } = render(
        <KpiTooltipContent metric="open_alerts_sku" />
      );
      const formula = Array.from(
        container.querySelectorAll("p.text-muted-foreground")
      );
      expect(formula.length).toBeGreaterThanOrEqual(1);
    });

    it("applies italic and muted-foreground to notes", () => {
      const { container } = render(
        <KpiTooltipContent metric="open_alerts_sku" />
      );
      const note = container.querySelector("p.italic.text-muted-foreground");
      expect(note).toBeInTheDocument();
    });
  });

  describe("max-width constraint", () => {
    it("constrains tooltip to 220px max-width", () => {
      const { container } = render(
        <KpiTooltipContent metric="critical_alerts" />
      );
      const wrapper = container.querySelector(".max-w-\\[220px\\]");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
