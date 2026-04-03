/** Card displaying organization information in a 2-column grid layout */

import { Building2 } from "lucide-react";
import type { CustomerOrganization } from "@/types/customer-organization";

interface OrgInfoCardProps {
  organization: CustomerOrganization;
}

interface InfoFieldProps {
  label: string;
  value: string | number;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#71717A]">{label}</span>
      <span className="text-sm font-medium text-[#09090B]">{value}</span>
    </div>
  );
}

export function OrgInfoCard({ organization }: OrgInfoCardProps) {
  return (
    <div className="rounded-[14px] border border-[#E4E4E7] bg-white">
      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-[#E4E4E7] px-6 py-4">
        <Building2 size={18} className="text-[#2556C5]" />
        <span className="text-[15px] font-semibold text-[#09090B]">Thông tin tổ chức</span>
      </div>

      {/* Card body — 2-column grid */}
      <div className="flex gap-8 p-6">
        {/* Column 1: tên & mã tổ chức */}
        <div className="flex flex-1 flex-col gap-5">
          <InfoField label="Tên tổ chức" value={organization.name} />
          <InfoField label="Mã tổ chức" value={organization.code} />
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-[#E4E4E7]" />

        {/* Column 2: địa chỉ & số thành viên */}
        <div className="flex flex-1 flex-col gap-5">
          <InfoField label="Địa chỉ" value={organization.address} />
          <InfoField label="Số thành viên" value={organization.member_count} />
        </div>
      </div>
    </div>
  );
}
