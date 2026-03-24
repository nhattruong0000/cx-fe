"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNavItem } from "./sidebar-nav-item";
import { navItems } from "./sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-lg font-bold">CX App</SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 p-2" onClick={() => setOpen(false)}>
          {navItems.map((item) => (
            <SidebarNavItem key={item.href} {...item} collapsed={false} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
