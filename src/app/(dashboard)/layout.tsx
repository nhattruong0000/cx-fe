"use client"

import { useState } from "react"
import { SidebarShell } from "@/components/layout/sidebar-shell"
import { Navbar } from "@/components/layout/navbar"
import { SidebarMobileSheet } from "@/components/layout/sidebar-mobile-sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <SidebarShell />
      </div>

      {/* Mobile sidebar sheet */}
      <SidebarMobileSheet
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
