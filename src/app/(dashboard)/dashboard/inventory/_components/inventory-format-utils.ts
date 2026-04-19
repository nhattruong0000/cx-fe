export function formatNumber(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return value.toLocaleString("vi-VN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDays(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `${value} ngày`;
}

export const SEVERITY_LABEL_VI: Record<string, string> = {
  critical: "Nghiêm trọng",
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

export const ALERT_TYPE_LABEL_VI: Record<string, string> = {
  stockout_risk: "Rủi ro hết hàng",
  low_stock: "Tồn kho thấp",
  overstock: "Tồn kho dư",
  forecast_gap: "Lệch dự báo",
  supplier_delay: "Chậm cung ứng",
};

export function severityLabel(sev: string): string {
  return SEVERITY_LABEL_VI[sev] ?? sev;
}

export function alertTypeLabel(t: string): string {
  return ALERT_TYPE_LABEL_VI[t] ?? t;
}
