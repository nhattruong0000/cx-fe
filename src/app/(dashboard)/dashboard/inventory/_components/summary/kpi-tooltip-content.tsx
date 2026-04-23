// Tooltip content for each KPI card — includes formula, data source field,
// and known data quality caveats (C3: overdue_po_count vs po_overdue mismatch,
// D2: reorder_needed_pct denominator clarification).

type Props = { metric: "open_alerts_sku" | "critical_alerts" | "overdue_po" | "reorder_pct" };

type FormulaEntry = {
  title: string;
  formula: string;
  source: string;
  note?: string;
  /** Data quality caveat — shown in amber to flag known BE inconsistency */
  caveat?: string;
};

const FORMULAS: Record<Props["metric"], FormulaEntry> = {
  open_alerts_sku: {
    title: "SKU có cảnh báo mở",
    formula: "Số lượng SKU có ít nhất 1 cảnh báo chưa xử lý",
    source: "Nguồn: hero_kpis.open_alerts_sku_count",
    note: "Bao gồm mọi mức độ (info → critical)",
  },
  critical_alerts: {
    title: "Cảnh báo nghiêm trọng",
    formula: "Tổng cảnh báo có severity = critical đang mở",
    source: "Nguồn: hero_kpis.critical_alerts_count",
    note: "Cần xử lý ngay để tránh stockout",
  },
  overdue_po: {
    title: "PO quá hạn",
    formula: "Số PO có expected_delivery_date < hôm nay và status ≠ completed",
    source: "Nguồn: hero_kpis.overdue_po_count",
    // C3: known discrepancy — overdue_po_count vs breakdown.alerts_by_type.po_overdue=0
    caveat:
      "Lưu ý: giá trị này có thể khác với breakdown.alerts_by_type.po_overdue — đang chờ BE xác nhận logic aggregation.",
  },
  reorder_pct: {
    title: "% SKU cần reorder",
    formula: "Tử số: SKU có DoC < 14 ngày hoặc tồn kho ≤ reorder_point",
    source: "Nguồn: hero_kpis.reorder_needed_pct — mẫu số: total_sku_tracked",
    // D2: denominator clarification
    note: "Mẫu số là tổng SKU đang được theo dõi (có reorder_point cấu hình)",
  },
};

export function KpiTooltipContent({ metric }: Props) {
  const info = FORMULAS[metric];
  return (
    <div className="max-w-[240px] space-y-1 text-xs">
      <p className="font-semibold">{info.title}</p>
      <p className="text-muted-foreground">{info.formula}</p>
      <p className="text-muted-foreground/80 text-[10px]">{info.source}</p>
      {info.note && (
        <p className="italic text-muted-foreground">{info.note}</p>
      )}
      {info.caveat && (
        <p className="mt-1 rounded bg-warning/10 px-1.5 py-1 text-[10px] text-warning leading-snug">
          {info.caveat}
        </p>
      )}
    </div>
  );
}
