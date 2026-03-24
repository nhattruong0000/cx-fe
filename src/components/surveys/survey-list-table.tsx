"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import type { Survey, SurveyType } from "@/types/survey";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SurveyTypeBadge } from "./survey-type-badge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatNumber } from "@/lib/utils";
import { useSurveys } from "@/hooks/use-surveys";
import { QueryBoundary } from "@/components/query-boundary";
import { SurveyListFilters } from "./survey-list-filters";
import type { SurveyFilters } from "@/lib/api/surveys";
import { ChevronLeft, ChevronRight } from "lucide-react";

const columns: ColumnDef<Survey>[] = [
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <Link
        href={`/surveys/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "type",
    header: "Loại",
    cell: ({ row }) => <SurveyTypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "responseCount",
    header: "Phản hồi",
    cell: ({ row }) => formatNumber(row.original.responseCount),
  },
  {
    accessorKey: "averageScore",
    header: "Điểm TB",
    cell: ({ row }) => row.original.averageScore.toFixed(1),
  },
  {
    accessorKey: "active",
    header: "Trạng thái",
    cell: ({ row }) => (
      <Badge variant={row.original.active ? "default" : "secondary"}>
        {row.original.active ? "Hoạt động" : "Tạm dừng"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];

export function SurveyListTable() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SurveyFilters>({});
  const { data, isLoading, isError, error, refetch } = useSurveys(page, 20, filters);

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilterChange = (key: keyof SurveyFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <SurveyListFilters
        filters={filters}
        onTypeChange={(v) => handleFilterChange("type", v as SurveyType | undefined)}
        onStatusChange={(v) => handleFilterChange("status", v)}
      />

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={data?.data.length === 0}
        emptyMessage="Không tìm thấy khảo sát nào"
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Trang {data.page}/{data.totalPages} ({data.total} khảo sát)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </QueryBoundary>
    </div>
  );
}
