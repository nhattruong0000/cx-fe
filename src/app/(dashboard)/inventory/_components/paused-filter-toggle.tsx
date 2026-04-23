"use client";

/**
 * PausedFilterToggle — toggle chip that persists `include_paused=true` in the URL
 * query string so the state survives refresh and is shareable via link.
 *
 * Integration: drop into SkuListToolbar and wire to the params passed to SkuListTable.
 * The BE stocks endpoint accepts `include_paused=true` to include paused SKUs.
 * If BE does not yet support the param, the list silently returns the same results
 * (param is ignored) — no client-side filtering needed as a fallback.
 */

import * as React from "react";
import { PauseCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PausedFilterToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
}

export function PausedFilterToggle({ value, onChange }: PausedFilterToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
        value
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-white text-muted-foreground hover:border-primary hover:text-primary",
      )}
    >
      <PauseCircle className="size-3.5 shrink-0" />
      Bao gồm SKU tạm dừng
    </button>
  );
}
