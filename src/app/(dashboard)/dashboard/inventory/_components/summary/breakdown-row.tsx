// Row 2: side-by-side donut + bar breakdown cards. Server component (no hooks/interactivity).

import { AlertsByTypeDonut } from "./alerts-by-type-donut";
import { StockHealthBar } from "./stock-health-bar";

export function BreakdownRow() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AlertsByTypeDonut />
      <StockHealthBar />
    </div>
  );
}
