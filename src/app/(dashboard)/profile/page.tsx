"use client"

import { AvatarUpload } from "@/components/account/avatar-upload"
import { ProfileForm } from "@/components/account/profile-form"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin cá nhân của bạn
        </p>
      </div>

      <Card className="max-w-2xl p-6">
        <AvatarUpload />
        <Separator className="my-6" />
        <ProfileForm />
      </Card>
    </div>
  )
}
