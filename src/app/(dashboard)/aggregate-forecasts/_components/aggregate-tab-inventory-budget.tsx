"use client";

import type { InventoryBudgetSection } from "../_types/aggregate-forecast";

const fmtVnd = (v: number): string =>
  v.toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export function AggregateTabInventoryBudget({
  section,
}: {
  section: InventoryBudgetSection;
}) {
  const totalRows = Object.entries(section.total ?? {});
  const perCat = Object.entries(section.per_category ?? {});

  if (totalRows.length === 0 && perCat.length === 0) {
    return (
      <div className="rounded-[14px] border border-border bg-card p-12 text-center text-sm text-muted-foreground">
        Chưa có forecast inventory budget.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Total card */}
      <div className="rounded-[14px] border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Total budget projection</h3>
        <div className="flex flex-wrap gap-4">
          {totalRows.map(([periodStart, values]) => (
            <div key={periodStart} className="rounded-[10px] bg-muted px-4 py-3">
              <div className="text-xs text-muted-foreground">
                {new Date(periodStart).toLocaleDateString("vi-VN")}
              </div>
              <div className="mt-1 text-base font-semibold text-foreground">
                {fmtVnd(values.cost)} đ
              </div>
              <div className="text-xs text-muted-foreground">
                qty {fmtVnd(values.qty)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Per-category */}
      <div className="rounded-[14px] border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Per-category breakdown ({perCat.length} categories)
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                Category
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold uppercase text-muted-foreground">
                Total cost
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold uppercase text-muted-foreground">
                Total qty
              </th>
            </tr>
          </thead>
          <tbody>
            {perCat.slice(0, 28).map(([catId, periods]) => {
              const totalCost = Object.values(periods).reduce((s, v) => s + v.cost, 0);
              const totalQty = Object.values(periods).reduce((s, v) => s + v.qty, 0);
              return (
                <tr key={catId} className="border-b border-border/40 last:border-0">
                  <td className="px-2 py-2 font-mono text-xs text-foreground">
                    {catId.slice(0, 8)}…
                  </td>
                  <td className="px-2 py-2 text-right">{fmtVnd(totalCost)} đ</td>
                  <td className="px-2 py-2 text-right text-muted-foreground">
                    {fmtVnd(totalQty)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
