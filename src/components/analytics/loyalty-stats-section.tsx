"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TierDistributionChart } from "./tier-distribution-chart";
import type { TierDistribution } from "@/types/analytics";
import { formatNumber } from "@/lib/utils";

interface LoyaltyStatsSectionProps {
  totalMembers: number;
  pointsIssued: number;
  pointsRedeemed: number;
  tierDistribution: TierDistribution[];
  isLoading?: boolean;
}

export function LoyaltyStatsSection({
  totalMembers,
  pointsIssued,
  pointsRedeemed,
  tierDistribution,
  isLoading,
}: LoyaltyStatsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Chương trình khách hàng thân thiết</h3>
      <Separator />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Tổng thành viên</p>
            <p className="mt-1 text-2xl font-bold">{formatNumber(totalMembers)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Điểm đã phát</p>
            <p className="mt-1 text-2xl font-bold">{formatNumber(pointsIssued)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Điểm đã đổi</p>
            <p className="mt-1 text-2xl font-bold">{formatNumber(pointsRedeemed)}</p>
          </CardContent>
        </Card>
      </div>
      <TierDistributionChart data={tierDistribution} isLoading={isLoading} />
    </div>
  );
}
