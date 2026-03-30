"use client";

import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrgDetail, useRemoveOrgMember } from "@/hooks/use-admin-orgs";

interface OrgDetailPanelProps {
  orgId: string;
  onBack: () => void;
}

export function OrgDetailPanel({ orgId, onBack }: OrgDetailPanelProps) {
  const { data: org, isLoading } = useOrgDetail(orgId);
  const removeMut = useRemoveOrgMember();

  const handleRemove = async (userId: number, name: string) => {
    try {
      await removeMut.mutateAsync({ orgId, userId });
      toast.success(`Đã xóa ${name} khỏi tổ chức`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xóa thất bại");
    }
  };

  if (isLoading || !org) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Tổ chức
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">{org.name}</span>
      </div>

      <div className="grid gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Ma:</span> {org.code}
        </div>
        {org.address && (
          <div>
            <span className="text-muted-foreground">Địa chỉ:</span>{" "}
            {org.address}
          </div>
        )}
        {org.phone && (
          <div>
            <span className="text-muted-foreground">SDT:</span> {org.phone}
          </div>
        )}
        {org.tax_code && (
          <div>
            <span className="text-muted-foreground">MST:</span> {org.tax_code}
          </div>
        )}
        <div>
          <span className="text-muted-foreground">Trạng thái:</span>{" "}
          <Badge variant={org.status === "active" ? "default" : "secondary"}>
            {org.status}
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold">
          Thành viên ({org.members.length})
        </h3>
        {org.members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có thành viên. Mời người dùng đầu tiên.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ten</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Quyền</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {org.members.map((member) => (
                <TableRow key={member.user_id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.org_role === "owner" ? "default" : "outline"
                      }
                    >
                      {member.org_role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.permissions.slice(0, 3).map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs">
                          {p}
                        </Badge>
                      ))}
                      {member.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{member.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="rounded-md p-1.5 hover:bg-accent">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            handleRemove(member.user_id, member.full_name)
                          }
                        >
                          Xóa khỏi tổ chức
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
