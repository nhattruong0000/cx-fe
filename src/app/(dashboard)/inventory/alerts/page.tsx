"use client";

import { RefreshCwIcon } from "lucide-react";
import { useAlertsList } from "./_hooks/use-alerts-list";
import { AlertsKpiStrip } from "./_components/alerts-kpi-strip";
import { AlertsFilterBar } from "./_components/alerts-filter-bar";
import { AlertsDataTable } from "./_components/alerts-data-table";
import { AlertsPagination } from "./_components/alerts-pagination";

/** Trang cảnh báo tồn kho — hiển thị danh sách, lọc, và xác nhận cảnh báo */
export default function InventoryAlertsPage() {
  const { query, filters, setFilter, acknowledge } = useAlertsList();

  const alerts = query.data?.data ?? [];
  const meta = query.data?.meta;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Cảnh báo tồn kho
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi và xử lý cảnh báo tồn kho theo SKU
          </p>
        </div>
        <button
          type="button"
          onClick={() => query.refetch()}
          disabled={query.isFetching}
          aria-label="Làm mới dữ liệu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-border bg-background text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCwIcon
            className={`size-4 ${query.isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* KPI strip */}
      <AlertsKpiStrip meta={meta} isLoading={query.isLoading} />

      {/* Filter bar */}
      <AlertsFilterBar filters={filters} onFilterChange={setFilter} />

      {/* Error state */}
      {query.isError && (
        <div className="flex items-center justify-between rounded-[10px] border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">
            Không thể tải dữ liệu cảnh báo. Vui lòng thử lại.
          </p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="text-sm font-medium text-destructive underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Data table */}
      <AlertsDataTable
        data={alerts}
        isLoading={query.isLoading}
        onAcknowledge={acknowledge}
      />

      {/* Pagination */}
      {meta && meta.total_pages > 0 && (
        <AlertsPagination
          meta={meta}
          onPageChange={(page) => setFilter("page", page)}
          isLoading={query.isFetching}
        />
      )}
    </div>
  );
}
