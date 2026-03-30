"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizations } from "@/hooks/use-admin-orgs";
import type { Organization } from "@/types/admin";

interface OrgsTableProps {
  page: number;
  search?: string;
  onSelectOrg: (org: Organization) => void;
}

export function OrgsTable({ page, search, onSelectOrg }: OrgsTableProps) {
  const { data, isLoading } = useOrganizations({ page, q: search });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const orgs = data?.data || [];

  if (orgs.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        {search ? "Không tìm thấy tổ chức phù hợp" : "Chưa có tổ chức nào"}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên tổ chức</TableHead>
          <TableHead>Ma</TableHead>
          <TableHead>Thành viên</TableHead>
          <TableHead>Trạng thái</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orgs.map((org) => (
          <TableRow
            key={org.id}
            className="cursor-pointer"
            onClick={() => onSelectOrg(org)}
          >
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell className="text-muted-foreground">{org.code}</TableCell>
            <TableCell>{org.member_count}</TableCell>
            <TableCell>
              <Badge variant={org.status === "active" ? "default" : "secondary"}>
                {org.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
