"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"

const STATUS_LABELS: Record<string, string> = {
  all: "Tất cả trạng thái",
  pending: "Đang chờ",
  accepted: "Đã chấp nhận",
  expired: "Hết hạn",
}

interface InvitationsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string | null) => void
}

export function InvitationsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: InvitationsToolbarProps) {
  const searchRef = React.useRef<HTMLInputElement>(null)

  // Ctrl+K / Cmd+K to focus search
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {/* Search by email */}
      <div className="relative w-[320px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#71717A] pointer-events-none" />
        <input
          ref={searchRef}
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm email..."
          className="h-11 w-full rounded-[10px] border border-[#E4E4E7] bg-[#FAFBFD] pl-9 pr-16 text-sm text-[#09090B] placeholder:text-[#71717A] outline-none focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex h-5 items-center gap-0.5 rounded border border-[#E4E4E7] bg-[#F8FAFC] px-1.5 text-[10px] font-medium text-[#94A3B8]">
          Ctrl+K
        </kbd>
      </div>

      {/* Status filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[180px]">
          <span className="flex flex-1 text-left">{STATUS_LABELS[status] ?? status}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="pending">Đang chờ</SelectItem>
          <SelectItem value="accepted">Đã chấp nhận</SelectItem>
          <SelectItem value="expired">Hết hạn</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
