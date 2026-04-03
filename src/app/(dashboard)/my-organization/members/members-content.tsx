"use client";

/** Main content for the organization members management page */

import { useState, useCallback, useEffect } from "react";
import { UserPlusIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useOrgMembers, useOrgInvitations } from "@/hooks/use-customer-organization";
import type { OrgMember } from "@/types/customer-organization";
import { OrgMembersTable } from "@/components/customer/org-members-table";
import { InviteMemberDialog } from "@/components/customer/invite-member-dialog";
import { EditMemberDialog } from "@/components/customer/edit-member-dialog";
import { DeleteMemberDialog } from "@/components/customer/delete-member-dialog";
import { PendingInvitationsTab } from "@/components/customer/pending-invitations-tab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

type DialogState =
  | { type: "invite" }
  | { type: "edit"; member: OrgMember }
  | { type: "delete"; member: OrgMember }
  | { type: null };

export function MembersContent() {
  const [search, setSearch] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState<DialogState>({ type: null });
  const [activeTab, setActiveTab] = useState<"members" | "pending">("members");

  // Debounce search — reset page on new query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const params = {
    page,
    per_page: PAGE_SIZE,
    ...(deferredSearch ? { q: deferredSearch } : {}),
  };

  const { data, isLoading } = useOrgMembers(params);
  const { data: invData } = useOrgInvitations();
  const members = data?.members ?? [];
  const pagination = data?.pagination;
  const totalCount = pagination?.total_count ?? 0;
  const totalPages = pagination?.total_pages ?? 1;
  const pendingCount = invData?.invitations?.length ?? 0;

  const closeDialog = useCallback(() => setDialog({ type: null }), []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-[#09090B]">Quản lý thành viên</h1>
          <p className="text-[13px] text-[#71717A]">
            Quản lý danh sách thành viên và quyền hạn trong tổ chức của bạn.
          </p>
        </div>
        <Button onClick={() => setDialog({ type: "invite" })} className="shadow-[0_2px_4px_#2556C520,0_8px_20px_#2556C525]">
          <UserPlusIcon className="size-4" />
          Mời thành viên
        </Button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[#E4E4E7]">
        <button
          onClick={() => setActiveTab("members")}
          className={`pb-2 pr-4 text-[13px] transition-colors ${activeTab === "members" ? "border-b-2 border-[#2556C5] font-semibold text-[#2556C5]" : "text-[#71717A] hover:text-[#3F3F46]"}`}
        >
          Thành viên {totalCount > 0 ? `(${totalCount})` : ""}
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-2 px-4 text-[13px] transition-colors ${activeTab === "pending" ? "border-b-2 border-[#2556C5] font-semibold text-[#2556C5]" : "text-[#71717A] hover:text-[#3F3F46]"}`}
        >
          Lời mời chờ {pendingCount > 0 ? `(${pendingCount})` : ""}
        </button>
      </div>

      {activeTab === "members" ? (
        <>
          {/* Search input */}
          <div className="relative max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#71717A]" />
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-sm text-[#71717A]">
              Đang tải...
            </div>
          ) : (
            <OrgMembersTable
              members={members}
              onEdit={(member) => setDialog({ type: "edit", member })}
              onDelete={(member) => setDialog({ type: "delete", member })}
            />
          )}

          {/* Pagination row */}
          {!isLoading && totalCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#71717A]">
                Hiển thị {members.length} / {totalCount} thành viên
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="size-8"
                  aria-label="Trang trước"
                >
                  <ChevronLeftIcon className="size-4" />
                </Button>
                <span className="px-2 text-[13px] text-[#3F3F46]">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="size-8"
                  aria-label="Trang sau"
                >
                  <ChevronRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <PendingInvitationsTab />
      )}

      {/* Dialogs */}
      <InviteMemberDialog
        open={dialog.type === "invite"}
        onClose={closeDialog}
      />
      <EditMemberDialog
        member={dialog.type === "edit" ? dialog.member : null}
        open={dialog.type === "edit"}
        onClose={closeDialog}
      />
      <DeleteMemberDialog
        member={dialog.type === "delete" ? dialog.member : null}
        open={dialog.type === "delete"}
        onClose={closeDialog}
      />
    </div>
  );
}
