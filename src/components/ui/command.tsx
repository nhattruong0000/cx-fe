"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function CommandPalette({
  open,
  onOpenChange,
  children,
}: CommandPaletteProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[20%] translate-y-0 p-0 shadow-2xl sm:max-w-lg"
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function CommandInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div className="flex items-center border-b px-3">
      <SearchIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
      <Input
        className={cn(
          "h-10 border-0 bg-transparent px-0 shadow-none outline-none focus-visible:ring-0 focus-visible:border-transparent",
          className
        )}
        {...props}
      />
    </div>
  )
}

export function CommandList({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "max-h-72 overflow-y-auto overscroll-contain p-1",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CommandGroup({
  heading,
  children,
}: {
  heading?: string
  children: React.ReactNode
}) {
  return (
    <div className="py-1">
      {heading && (
        <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
          {heading}
        </p>
      )}
      {children}
    </div>
  )
}

export function CommandItem({
  className,
  children,
  onSelect,
  ...props
}: React.ComponentProps<"button"> & { onSelect?: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={onSelect}
      {...props}
    >
      {children}
    </button>
  )
}

export function CommandEmpty({ children }: { children?: React.ReactNode }) {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">
      {children ?? "Không tìm thấy kết quả"}
    </p>
  )
}
