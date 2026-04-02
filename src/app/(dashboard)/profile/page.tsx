"use client";

import { ProfilePersonalInfoCard } from "@/components/account/profile-personal-info-card";
import { ProfileChangePasswordCard } from "@/components/account/profile-change-password-card";
import { ProfileNotificationPreferencesCard } from "@/components/account/profile-notification-preferences-card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[#09090B]">Cài đặt hồ sơ</h1>
        <p className="text-sm text-[#71717A]">
          Quản lý thông tin cá nhân, mật khẩu và tùy chọn thông báo.
        </p>
      </div>

      {/* Cards */}
      <ProfilePersonalInfoCard />
      <ProfileChangePasswordCard />
      <ProfileNotificationPreferencesCard />
    </div>
  );
}
