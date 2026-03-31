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
  className?: string
}

function DataTable<TData>({
  columns,
  data,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterSlot,
  className,
}: DataTableProps<TData>) {
  const table: ReactTable<TData> = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
              <tr key={headerGroup.id} className="border-b border-[#E4E4E7] bg-[#F8FAFC]">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#71717A]"
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
                  className="border-b border-[#E4E4E7] bg-white transition-colors hover:bg-[#F8FAFC] last:border-b-0"
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
                  No results found.
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
