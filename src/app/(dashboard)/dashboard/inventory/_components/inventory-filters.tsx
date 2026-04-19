"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useInventoryDashboardStore } from "../_store/inventory-dashboard-store";

export function InventoryFilters() {
  const {
    itemCodeSearch,
    setItemCodeSearch,
    branchFilter,
    setBranchFilter,
    alertTypeFilter,
    severityFilter,
    setAlertTypeFilter,
    setSeverityFilter,
  } = useInventoryDashboardStore();

  const hasActiveFilter =
    itemCodeSearch || branchFilter || alertTypeFilter || severityFilter;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
        <Input
          placeholder="Tìm mã SKU…"
          value={itemCodeSearch}
          onChange={(e) => setItemCodeSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Input
        placeholder="Mã chi nhánh (optional)"
        value={branchFilter ?? ""}
        onChange={(e) => setBranchFilter(e.target.value || null)}
        className="max-w-[200px]"
      />

      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setItemCodeSearch("");
            setBranchFilter(null);
            setAlertTypeFilter(null);
            setSeverityFilter(null);
          }}
        >
          <X className="h-3.5 w-3.5" /> Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
