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

interface SearchableOrgSelectProps {
  value?: string
  onChange: (val: string | undefined) => void
  organizations: { id: string; name: string; code?: string }[]
}

/** Searchable dropdown for organizations */
export function SearchableOrgSelect({ value, onChange, organizations }: SearchableOrgSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)

  const filtered = organizations.filter((o) => {
    const label = o.code ? `${o.code} - ${o.name}` : o.name
    return label.toLowerCase().includes(search.toLowerCase())
  })
  const selectedOrg = organizations.find((o) => o.id === value)
  const selectedLabel = selectedOrg ? (selectedOrg.code ? `${selectedOrg.code} - ${selectedOrg.name}` : selectedOrg.name) : undefined

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
      <FormLabel>Tổ chức <span className="text-destructive">*</span></FormLabel>
      <div ref={containerRef} className="relative">
        {/* Trigger */}
        <button
          type="button"
          onClick={() => { setOpen(!open); setSearch("") }}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-[10px] border border-[#E4E4E7] bg-white px-3 text-sm transition-colors outline-none",
            "focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20",
            selectedOrg ? "text-[#09090B]" : "text-[#94A3B8]"
          )}
        >
          <span className="truncate">
            {selectedOrg ? (
              <>{selectedOrg.code && <strong>{selectedOrg.code}</strong>}{selectedOrg.code && " - "}{selectedOrg.name}</>
            ) : "Chọn tổ chức..."}
          </span>
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
                placeholder="Tìm tổ chức..."
                className="w-full bg-transparent text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none"
                autoFocus
              />
            </div>
            {/* Options */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filtered.length > 0 ? (
                filtered.map((org) => (
                  <button
                    key={org.id}
                    type="button"
                    onClick={() => {
                      onChange(org.id)
                      setOpen(false)
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-[#09090B] hover:bg-[#F1F5F9]",
                      org.id === value && "bg-[#F1F5F9]"
                    )}
                  >
                    <span className="truncate">
                      {org.code && <strong>{org.code}</strong>}{org.code && " - "}{org.name}
                    </span>
                    {org.id === value && <CheckIcon className="size-4 shrink-0 text-[#2556C5]" />}
                  </button>
                ))
              ) : (
                <p className="px-2 py-3 text-center text-sm text-[#71717A]">Không tìm thấy tổ chức.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <FormDescription>Chọn tổ chức mà khách hàng sẽ tham gia.</FormDescription>
      <FormMessage />
    </FormItem>
  )
}
