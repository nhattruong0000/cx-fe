"use client";

/** Members table for organization management page */

import { PencilIcon, Trash2Icon } from "lucide-react";
import type { OrgMember } from "@/types/customer-organization";
import { PERMISSION_LABELS } from "@/constants/customer-permissions";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar-helpers";

interface OrgMembersTableProps {
  members: OrgMember[];
  onEdit: (member: OrgMember) => void;
  onDelete: (member: OrgMember) => void;
}

export function OrgMembersTable({ members, onEdit, onDelete }: OrgMembersTableProps) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E4E4E7]">
      {/* Table header */}
      <div className="grid grid-cols-[2fr_2fr_1fr_2fr_80px] bg-[#F4F4F5] px-4 py-3">
        <span className="text-[13px] font-semibold text-[#3F3F46]">Thành viên</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Email</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Vai trò</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Quyền hạn</span>
        <span className="text-[13px] font-semibold text-[#3F3F46]">Thao tác</span>
      </div>

      {/* Rows */}
      {members.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-[#71717A]">
          Chưa có thành viên nào
        </div>
      ) : (
        members.map((member) => (
          <MemberRow
            key={member.user_id}
            member={member}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

interface MemberRowProps {
  member: OrgMember;
  onEdit: (member: OrgMember) => void;
  onDelete: (member: OrgMember) => void;
}

function MemberRow({ member, onEdit, onDelete }: MemberRowProps) {
  const isOwner = member.org_role === "owner";
  const visiblePerms = member.permissions.slice(0, 2);
  const extraCount = member.permissions.length - 2;

  return (
    <div className="grid grid-cols-[2fr_2fr_1fr_2fr_80px] items-center border-b border-[#E4E4E7] px-4 py-3 last:border-b-0">
      {/* Avatar + Name */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
          style={{ backgroundColor: getAvatarColor(member.full_name) }}
        >
          {getInitials(member.full_name)}
        </div>
        <span className="text-[13px] font-medium text-[#09090B] truncate">{member.full_name}</span>
      </div>

      {/* Email */}
      <span className="text-[13px] text-[#71717A] truncate">{member.email}</span>

      {/* Role badge */}
      {isOwner ? (
        <span className="inline-flex w-fit items-center rounded-full bg-[#EBF0FA] px-2.5 py-0.5 text-xs font-medium text-[#2556C5]">
          Chủ sở hữu
        </span>
      ) : (
        <span className="inline-flex w-fit items-center rounded-full bg-[#F4F4F5] px-2.5 py-0.5 text-xs font-medium text-[#71717A]">
          Thành viên
        </span>
      )}

      {/* Permissions */}
      <div className="flex flex-wrap gap-1">
        {visiblePerms.map((perm) => (
          <span
            key={perm}
            className="rounded bg-[#F4F4F5] px-2 py-0.5 text-[11px] text-[#3F3F46]"
          >
            {PERMISSION_LABELS[perm] ?? perm}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="rounded bg-[#F4F4F5] px-2 py-0.5 text-[11px] text-[#71717A]">
            +{extraCount}
          </span>
        )}
        {member.permissions.length === 0 && (
          <span className="text-[13px] text-[#71717A]">—</span>
        )}
      </div>

      {/* Actions */}
      {isOwner ? (
        <span className="text-[13px] text-[#71717A]">—</span>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(member)}
            className="rounded p-1 text-[#71717A] transition-colors hover:bg-[#F4F4F5] hover:text-[#3F3F46]"
            aria-label="Chỉnh sửa thành viên"
          >
            <PencilIcon size={16} />
          </button>
          <button
            onClick={() => onDelete(member)}
            className="rounded p-1 text-[#E81B22] transition-colors hover:bg-[#FEF2F2]"
            aria-label="Xóa thành viên"
          >
            <Trash2Icon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
