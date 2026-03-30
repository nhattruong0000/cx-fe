"use client";

import Link from "next/link";
import { ClipboardList, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth-store";
import { useCustomerDashboard } from "@/hooks/use-analytics";
import { formatDate } from "@/lib/utils";

export default function CustomerHomePage() {
  const user = useAuthStore((s) => s.user);
  const orgId = useAuthStore((s) => s.activeOrganizationId);
  const { data, isLoading } = useCustomerDashboard(orgId || undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Xin chào, {user?.full_name || ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          Tổng quan hoạt động của bạn
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/customer/surveys" className="group">
            <Card className="transition-shadow group-hover:shadow-md">
              <CardHeader className="flex-row items-center gap-3 pb-2">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Khảo sát</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {data?.surveys.pending_count || 0} khảo sát cần phản hồi
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/customer/support" className="group">
            <Card className="transition-shadow group-hover:shadow-md">
              <CardHeader className="flex-row items-center gap-3 pb-2">
                <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                  <Wrench className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Hỗ trợ KT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {data?.support.active_count || 0} yêu cầu đang xử lý
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      {data?.recent_activities && data.recent_activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recent_activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
