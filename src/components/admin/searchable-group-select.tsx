"use client"

import * as React from "react"
import { SearchIcon, ChevronDownIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"

interface SearchableGroupSelectProps {
  value?: string
  onChange: (val: string | undefined) => void
  groups: { id: string; name: string }[]
}

/** Searchable dropdown for permission groups */
export function SearchableGroupSelect({ value, onChange, groups }: SearchableGroupSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )
  const selectedName = groups.find((g) => g.id === value)?.name

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  return (
    <FormItem>
      <FormLabel>Nhóm quyền hạn</FormLabel>
      <div ref={containerRef} className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => { setOpen(!open); setSearch("") }}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-[10px] border border-[#E4E4E7] bg-white px-3 text-sm transition-colors outline-none",
            "focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20",
            selectedName ? "text-[#09090B]" : "text-[#94A3B8]"
          )}
        >
          <span className="truncate">{selectedName ?? "Chọn một nhóm..."}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-[#71717A]" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-[10px] border border-[#E4E4E7] bg-white shadow-md">
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-[#E4E4E7] px-3 py-2">
              <SearchIcon className="size-4 shrink-0 text-[#71717A]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm nhóm..."
                className="w-full bg-transparent text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none"
                autoFocus
              />
            </div>
            {/* Options */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filtered.length > 0 ? (
                filtered.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      onChange(group.id === value ? undefined : group.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-[#09090B] hover:bg-[#F1F5F9]",
                      group.id === value && "bg-[#F1F5F9]"
                    )}
                  >
                    {group.name}
                    {group.id === value && <CheckIcon className="size-4 text-[#2556C5]" />}
                  </button>
                ))
              ) : (
                <p className="px-2 py-3 text-center text-sm text-[#71717A]">Không tìm thấy nhóm.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <FormDescription>Gán nhóm quyền hạn để xác định cấp độ truy cập.</FormDescription>
      <FormMessage />
    </FormItem>
  )
}
