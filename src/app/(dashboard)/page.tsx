"use client";

import Link from "next/link";
import {
  ClipboardList,
  MessageSquare,
  BarChart3,
  Route,
  Plus,
  Mail,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useJourneyStats } from "@/hooks/use-analytics";
import { useConversations } from "@/hooks/use-chat";
import { useSurveys } from "@/hooks/use-surveys";

const modules = [
  {
    key: "surveys",
    href: "/surveys",
    icon: ClipboardList,
    title: "Khao sat",
    color: "text-blue-600 bg-blue-50",
  },
  {
    key: "chat",
    href: "/chat",
    icon: MessageSquare,
    title: "Chat",
    color: "text-orange-600 bg-orange-50",
  },
  {
    key: "analytics",
    href: "/analytics",
    icon: BarChart3,
    title: "Phan tich",
    color: "text-green-600 bg-green-50",
  },
  {
    key: "journey",
    href: "/journey",
    icon: Route,
    title: "Hanh trinh",
    color: "text-purple-600 bg-purple-50",
  },
] as const;

function StatSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const stats = useDashboardStats();
  const journey = useJourneyStats();
  const conversations = useConversations();
  const surveys = useSurveys(1, 5);

  const isLoading =
    stats.isLoading || journey.isLoading || conversations.isLoading || surveys.isLoading;

  function getStat(key: (typeof modules)[number]["key"]): string {
    if (isLoading) return "...";
    switch (key) {
      case "surveys":
        return `${surveys.data?.total ?? 0} khao sat`;
      case "chat":
        return `${conversations.data?.total ?? 0} hoi thoai`;
      case "analytics":
        return `NPS ${stats.data?.npsScore ?? "-"} | CSAT ${stats.data?.csatAverage ?? "-"}`;
      case "journey":
        return `${journey.data?.uniqueCustomers ?? 0} khach hang`;
    }
  }

  function getSubStat(key: (typeof modules)[number]["key"]): string {
    if (isLoading) return "";
    switch (key) {
      case "surveys":
        return `Ti le phan hoi: ${stats.data?.responseRate ?? 0}%`;
      case "chat":
        return `${stats.data?.chatVolume ?? 0} tin nhan hom nay`;
      case "analytics":
        return `Ti le giai quyet: ${stats.data?.avgResolutionTime ?? 0}h`;
      case "journey":
        return `Ti le chuyen doi: ${journey.data?.conversionRate ?? 0}%`;
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tong quan</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tong quan</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.key} href={mod.href} className="group">
              <Card className="transition-shadow group-hover:shadow-md">
                <CardHeader className="flex-row items-center gap-3">
                  <div className={`rounded-lg p-2 ${mod.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{mod.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{getStat(mod.key)}</p>
                  <CardDescription>{getSubStat(mod.key)}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Thao tac nhanh</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/surveys/create" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Tao khao sat
          </Link>
          <Link href="/chat" className={buttonVariants({ variant: "outline" })}>
            <Mail className="mr-2 h-4 w-4" />
            Xem hop thu
          </Link>
          <Link href="/analytics" className={buttonVariants({ variant: "outline" })}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Xem phan tich
          </Link>
        </div>
      </div>
    </div>
  );
}
