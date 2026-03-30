"use client";

import Link from "next/link";
import {
  ClipboardList,
  Wrench,
  BarChart3,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { useDashboardSummary } from "@/hooks/use-analytics";
import type { DashboardSummary } from "@/types/analytics";
import type { LucideIcon } from "lucide-react";

interface ModuleItem {
  href: string;
  icon: LucideIcon;
  title: string;
  color: string;
  permissions: string[];
  adminOnly?: boolean;
  getStat: (d: DashboardSummary) => string;
}

const modules: ModuleItem[] = [
  {
    href: "/surveys",
    icon: ClipboardList,
    title: "Khảo sát",
    color: "text-blue-600 bg-blue-50",
    permissions: ["survey:create", "survey:edit", "survey:view_responses"],
    getStat: (d) => `${d.surveys.active} đang hoạt động · ${d.surveys.responses} phản hồi`,
  },
  {
    href: "/schedules",
    icon: Wrench,
    title: "Hỗ trợ KT",
    color: "text-orange-600 bg-orange-50",
    permissions: ["support:manage", "support:update", "support:view_all"],
    getStat: (d) => `${d.support.pending} chờ xử lý · ${d.support.today} hôm nay`,
  },
  {
    href: "/analytics",
    icon: BarChart3,
    title: "Phân tích",
    color: "text-green-600 bg-green-50",
    permissions: ["analytics:view"],
    getStat: (d) => `NPS ${d.analytics.nps} · CSAT ${d.analytics.csat}`,
  },
  {
    href: "/settings/users",
    icon: Settings,
    title: "Cài đặt",
    color: "text-purple-600 bg-purple-50",
    permissions: [],
    adminOnly: true,
    getStat: (d) => `${d.users.total} người dùng · ${d.users.groups} nhóm`,
  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { canAny, role } = usePermissions();
  const { data, isLoading } = useDashboardSummary();

  const visibleModules = modules.filter((m) => {
    if (m.adminOnly && role !== "admin") return false;
    return canAny(m.permissions);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Xin chào, {user?.full_name || ""}
        </h1>
        <p className="text-sm text-muted-foreground">Tổng quan hệ thống</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.href} href={mod.href} className="group">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader className="flex-row items-center gap-3 pb-2">
                    <div className={`rounded-lg p-2 ${mod.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{mod.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {data ? mod.getStat(data) : "..."}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
