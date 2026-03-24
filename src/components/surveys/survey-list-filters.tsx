"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SurveyFilters } from "@/lib/api/surveys";

interface SurveyListFiltersProps {
  filters: SurveyFilters;
  onTypeChange: (value: string | undefined) => void;
  onStatusChange: (value: string | undefined) => void;
}

export function SurveyListFilters({
  filters,
  onTypeChange,
  onStatusChange,
}: SurveyListFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={filters.type ?? "all"}
        onValueChange={(v) => onTypeChange(!v || v === "all" ? undefined : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Loại khảo sát" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại</SelectItem>
          <SelectItem value="CSAT">CSAT</SelectItem>
          <SelectItem value="CES">CES</SelectItem>
          <SelectItem value="NPS">NPS</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status ?? "all"}
        onValueChange={(v) => onStatusChange(!v || v === "all" ? undefined : v)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Hoạt động</SelectItem>
          <SelectItem value="inactive">Tạm dừng</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
