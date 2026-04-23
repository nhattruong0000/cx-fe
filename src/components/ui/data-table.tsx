"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Table as ReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"

// Generic DataTable — column definitions live in consumer files (YAGNI)
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  /** Optional search input slot rendered above the table */
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  /** Optional filter slot (role/status dropdowns, etc.) */
  filterSlot?: React.ReactNode
  /** Table meta passed to useReactTable — accessible in column cells via table.options.meta */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>
  className?: string
  /** Optional row click handler — receives the row's original data object */
  onRowClick?: (row: TData) => void
  /** Optional function to get test ID for a row */
  getRowTestId?: (row: TData) => string
  /** Optional function to get data attributes for a row */
  getRowDataAttrs?: (row: TData) => Record<string, string>
}

function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Tìm kiếm...",
  searchValue,
  onSearchChange,
  filterSlot,
  meta,
  className,
  onRowClick,
  getRowTestId,
  getRowDataAttrs,
}: DataTableProps<TData>) {
  const table: ReactTable<TData> = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
  })

  return (
    <div className={cn("w-full", className)}>
      {/* Toolbar: search + filter slots */}
      {(onSearchChange != null || filterSlot != null) && (
        <div className="mb-4 flex items-center gap-3">
          {onSearchChange != null && (
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-full max-w-xs rounded-[10px] border border-[#E4E4E7] bg-white px-3 text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20"
            />
          )}
          {filterSlot}
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-[10px] border border-[#E4E4E7]">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-[#E4E4E7] bg-[#EBF0FA]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[13px] font-semibold text-[#71717A]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[#E4E4E7] bg-white transition-colors hover:bg-[#F8FAFC] last:border-b-0",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  {...(getRowTestId && { "data-testid": getRowTestId(row.original) })}
                  {...(getRowDataAttrs ? getRowDataAttrs(row.original) : {})}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-[#09090B]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-[#71717A]"
                >
                  Không tìm thấy kết quả.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { DataTable }
export type { DataTableProps }
