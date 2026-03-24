"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";
import { UserMenu } from "./user-menu";
import { BreadcrumbNav } from "./breadcrumb-nav";

export function Header() {
  return (
    <header className="flex h-[var(--header-height)] items-center justify-between gap-4 border-b bg-background px-8">
      <MobileSidebar />
      <BreadcrumbNav />
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm..." className="w-56 pl-8" />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Thông báo</span>
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
