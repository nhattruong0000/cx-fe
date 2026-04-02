"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardIconMap } from "@/lib/dashboard-icon-map";
import { statusVariant, formatDate } from "@/lib/dashboard-table-utils";
import type { CustomerDashboardSummary } from "@/types/dashboard";

interface CustomerDashboardProps {
  data: CustomerDashboardSummary;
}

export function CustomerDashboard({ data }: CustomerDashboardProps) {
  return (
    <div className="min-h-full">
      <h1 className="mb-6 text-2xl font-semibold text-[#09090B]">Dashboard</h1>

      {/* Welcome */}
      <p className="mb-6 text-lg font-semibold">Welcome back, {data.user_name}</p>

      {/* Top Row: Org Info + Team Members */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        {/* Organization Info */}
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Organization</p>
          <p className="mt-1 truncate text-xl font-bold">{data.organization.name}</p>
          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Role</span>
              <p className="font-medium">{data.organization.role}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Members</span>
              <p className="font-medium">{data.organization.members_count}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Plan</span>
              <p className="font-medium">{data.organization.plan}</p>
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold">Team Members</p>
            <Badge variant="secondary">{data.team_members.length}</Badge>
          </div>
          {data.team_members.length === 0 ? (
            <p className="text-sm text-muted-foreground">No team members</p>
          ) : (
            <div className="space-y-3">
              {data.team_members.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {member.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{member.full_name}</p>
                    <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Stats Row: 3 cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
            icon={dashboardIconMap[stat.icon] ?? dashboardIconMap.users}
          />
        ))}
      </div>

      {/* Survey Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          {data.surveys.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No surveys available</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Survey Name</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {data.surveys.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="py-3">{row.name}</td>
                    <td className="py-3">
                      <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
