import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { InvitationDetails } from "@/types/auth"

export function InviteInfoCard({ invite }: { invite: InvitationDetails }) {
  return (
    <div className="rounded-[10px] border border-[#E4E4E7] bg-[#F4F4F5] p-4">
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-muted-foreground">Invited by</span>
        <span className="text-sm font-medium">{invite.inviter_name}</span>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-muted-foreground">Organization</span>
        <span className="text-sm font-medium">
          {invite.organization_name}
        </span>
      </div>
      <Separator />
      <div className="flex items-center justify-between py-1">
        <span className="text-sm text-muted-foreground">Role</span>
        <Badge variant="success">{invite.role}</Badge>
      </div>
    </div>
  )
}
