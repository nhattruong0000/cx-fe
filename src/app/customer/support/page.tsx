"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportRequestCard } from "@/components/customer/support-request-card";
import { useCustomerSupportRequests } from "@/hooks/use-support-requests";

export default function CustomerSupportPage() {
  const { data: requests, isLoading } = useCustomerSupportRequests();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hỗ trợ kỹ thuật</h1>
          <p className="text-sm text-muted-foreground">
            Yêu cầu và theo dõi hỗ trợ kỹ thuật
          </p>
        </div>
        <Button render={<Link href="/customer/support/create" />}>
          <Plus className="mr-1 h-4 w-4" />
          Tạo yêu cầu
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !requests?.length ? (
        <p className="py-8 text-center text-muted-foreground">
          Chưa có yêu cầu hỗ trợ nào
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests.map((req) => (
            <SupportRequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
}
