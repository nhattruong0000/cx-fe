"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { OrgSwitcher } from "./org-switcher";
import { UserMenuDropdown } from "./user-menu-dropdown";

const navItems = [
  { href: "/customer", label: "Trang chủ", permissions: [] as string[] },
  {
    href: "/customer/surveys",
    label: "Khảo sát",
    permissions: ["survey:view", "survey:submit"],
  },
  {
    href: "/customer/support",
    label: "Hỗ trợ",
    permissions: ["support:create", "support:view"],
  },
  { href: "/customer/profile", label: "Tài khoản", permissions: [] as string[] },
];

export function CustomerHeader() {
  const pathname = usePathname();
  const { canAny } = usePermissions();

  const visibleItems = navItems.filter((item) => canAny(item.permissions));

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <Link href="/customer" className="text-lg font-semibold text-primary">
          CX Platform
        </Link>
        <OrgSwitcher />
      </div>
      <nav className="hidden items-center gap-1 md:flex">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/customer"
              ? pathname === "/customer"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <UserMenuDropdown />
    </header>
  );
}
