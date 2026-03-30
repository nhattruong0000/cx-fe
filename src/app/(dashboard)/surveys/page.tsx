"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyTable } from "@/components/surveys/survey-table";
import { useDebounce } from "@/hooks/use-debounce";

export default function SurveysPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Khảo sát</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý khảo sát CSAT, NPS, CES
          </p>
        </div>
        <Button render={<Link href="/surveys/create" />}>
          <Plus className="mr-1 h-4 w-4" />
          Tạo khảo sát
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khảo sát..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v === "all" ? "" : v || "")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="CSAT">CSAT</SelectItem>
            <SelectItem value="NPS">NPS</SelectItem>
            <SelectItem value="CES">CES</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v || "")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="closed">Đóng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SurveyTable
        page={page}
        surveyType={typeFilter || undefined}
        status={statusFilter || undefined}
        search={debouncedSearch || undefined}
      />
    </div>
  );
}
