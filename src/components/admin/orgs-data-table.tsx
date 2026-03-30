"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/hooks/use-admin-orgs";
import { OrgStatusBadge, OrgRowActions } from "./orgs-table-columns";

export function OrgsDataTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrganizations({
    q: search || undefined,
    page,
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tim to chuc..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Ten</th>
              <th className="px-4 py-3 text-left font-medium">Ma</th>
              <th className="px-4 py-3 text-left font-medium">Dia chi</th>
              <th className="px-4 py-3 text-left font-medium">Thanh vien</th>
              <th className="px-4 py-3 text-left font-medium">Trang thai</th>
              <th className="px-4 py-3 text-right font-medium w-12" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton className="h-5 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : !data?.data.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Khong tim thay to chuc nao
                </td>
              </tr>
            ) : (
              data.data.map((org) => (
                <tr key={org.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{org.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {org.code}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                    {org.address || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {org.member_count}
                  </td>
                  <td className="px-4 py-3">
                    <OrgStatusBadge status={org.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <OrgRowActions org={org} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Trang {data.page} / {data.totalPages} ({data.total} to chuc)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Truoc
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
