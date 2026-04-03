import type { InvitationDetails } from "@/types/auth"

export function InviteInfoCard({ invite }: { invite: InvitationDetails }) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] border border-[#E4E4E7] bg-[#F4F4F5] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">Được mời bởi</span>
        <span className="text-[13px] font-semibold">{invite.inviter_name}</span>
      </div>
      {invite.role === "customer" && (
        <>
          <div className="h-px w-full bg-[#E4E4E7]" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-muted-foreground">Tổ chức</span>
            <span className="text-[13px] font-semibold">
              {invite.organization_name}
            </span>
          </div>
        </>
      )}
      <div className="h-px w-full bg-[#E4E4E7]" />
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">Vai trò</span>
        <span className="rounded-full bg-[#EBF0FA] px-2.5 py-0.5 text-xs font-semibold text-primary">
          {invite.role}
        </span>
      </div>
    </div>
  )
}
