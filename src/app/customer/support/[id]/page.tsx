"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportDetailView } from "@/components/customer/support-detail-view";

export default function SupportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/customer/support" />}>
        <ArrowLeft className="mr-1 h-4 w-4" />
        Hỗ trợ
      </Button>
      <SupportDetailView requestId={Number(id)} />
    </div>
  );
}
