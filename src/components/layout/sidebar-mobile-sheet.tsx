"use client"

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarShell } from "@/components/layout/sidebar-shell"

interface SidebarMobileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SidebarMobileSheet({
  open,
  onOpenChange,
}: SidebarMobileSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-60 p-0" showCloseButton={false}>
        <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
        <SidebarShell />
      </SheetContent>
    </Sheet>
  )
}
