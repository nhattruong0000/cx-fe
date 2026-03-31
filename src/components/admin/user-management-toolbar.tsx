"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserManagementToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  role: string
  onRoleChange: (value: string | null) => void
  status: string
  onStatusChange: (value: string | null) => void
}

export function UserManagementToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: UserManagementToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Search input with icon and kbd hint */}
      <div className="relative w-[320px]">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#94A3B8] pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search users..."
          className="h-10 w-full rounded-[10px] border border-[#E4E4E7] bg-white pl-9 pr-16 text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex h-5 items-center gap-0.5 rounded border border-[#E4E4E7] bg-[#F8FAFC] px-1.5 text-[10px] font-medium text-[#94A3B8]">
          Ctrl+K
        </kbd>
      </div>

      {/* Role filter */}
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="staff">Staff</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
