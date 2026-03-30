"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import type { Organization } from "@/types/admin";

const statusVariant: Record<string, "success" | "destructive"> = {
  active: "success",
  inactive: "destructive",
};

export function OrgStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariant[status] ?? "outline"}>
      {status === "active" ? "Hoat dong" : "Ngung hoat dong"}
    </Badge>
  );
}

interface OrgRowActionsProps {
  org: Organization;
  onView?: (id: string) => void;
}

export function OrgRowActions({ org, onView }: OrgRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView?.(org.id)}>
          <Eye className="size-4" />
          Xem chi tiet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
