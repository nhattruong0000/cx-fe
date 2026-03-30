"use client"

import { BreadcrumbNav } from "@/components/layout/breadcrumb-nav"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

interface NavbarProps {
  onMobileMenuToggle: () => void
}

export function Navbar({ onMobileMenuToggle }: NavbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onMobileMenuToggle}
        aria-label="Mở menu"
      >
        <MenuIcon className="size-5" />
      </Button>

      {/* Breadcrumb */}
      <BreadcrumbNav className="flex-1" />
    </header>
  )
}
