import {
  UserIcon,
  ShieldIcon,
  UsersIcon,
  LockIcon,
  GroupIcon,
  BuildingIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { UserRole } from "@/types/common"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Minimum role required. undefined = visible to all authenticated users */
  requiredRole?: UserRole
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const sidebarNavSections: NavSection[] = [
  {
    title: "Tài khoản",
    items: [
      { label: "Hồ sơ", href: "/profile", icon: UserIcon },
      { label: "Bảo mật", href: "/security", icon: ShieldIcon },
    ],
  },
  {
    title: "Quản trị",
    items: [
      { label: "Người dùng", href: "/users", icon: UsersIcon, requiredRole: "admin" },
      {
        label: "Nhóm quyền",
        href: "/permission-groups",
        icon: LockIcon,
        requiredRole: "admin",
      },
      {
        label: "Nhóm người dùng",
        href: "/user-groups",
        icon: GroupIcon,
        requiredRole: "admin",
      },
      {
        label: "Tổ chức",
        href: "/organizations",
        icon: BuildingIcon,
        requiredRole: "admin",
      },
    ],
  },
]

/** Flatten all nav items for quick lookup */
export function getAllNavItems(): NavItem[] {
  return sidebarNavSections.flatMap((s) => s.items)
}
