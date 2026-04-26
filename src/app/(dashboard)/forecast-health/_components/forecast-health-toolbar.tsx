"use client";

import { SearchIcon } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  classificationFilter: string;
  onClassificationChange: (v: string) => void;
  branchFilter: string;
  onBranchChange: (v: string) => void;
  branches: string[];
};

const CLASSIFICATIONS = ["all", "regular", "seasonal", "on_demand", "low_signal", "dormant"] as const;

export function ForecastHealthToolbar({
  search,
  onSearchChange,
  classificationFilter,
  onClassificationChange,
  branchFilter,
  onBranchChange,
  branches,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[260px]">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm SKU hoặc item code..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full rounded-[10px] border border-input bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
          Ctrl+K
        </kbd>
      </div>
      <select
        value={branchFilter}
        onChange={(e) => onBranchChange(e.target.value)}
        className="h-10 min-w-[160px] rounded-[10px] border border-input bg-background px-3 text-sm text-muted-foreground"
      >
        <option value="all">Tất cả branch</option>
        {branches.map((b) => (
          <option key={b} value={b}>
            {b.slice(0, 8)}…
          </option>
        ))}
      </select>
      <select
        value={classificationFilter}
        onChange={(e) => onClassificationChange(e.target.value)}
        className="h-10 min-w-[180px] rounded-[10px] border border-input bg-background px-3 text-sm text-muted-foreground"
      >
        {CLASSIFICATIONS.map((c) => (
          <option key={c} value={c}>
            {c === "all" ? "Tất cả classification" : c}
          </option>
        ))}
      </select>
    </div>
  );
}
