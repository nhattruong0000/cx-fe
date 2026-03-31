"use client";

import { ProfilePersonalInfoCard } from "@/components/account/profile-personal-info-card";
import { ProfileChangePasswordCard } from "@/components/account/profile-change-password-card";
import { ProfileNotificationPreferencesCard } from "@/components/account/profile-notification-preferences-card";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[800px] space-y-6 px-4 py-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#09090B]">Profile Settings</h1>
        <p className="mt-1 text-sm text-[#71717A]">
          Manage your personal information, security, and notification preferences.
        </p>
      </div>

      {/* Cards */}
      <ProfilePersonalInfoCard />
      <ProfileChangePasswordCard />
      <ProfileNotificationPreferencesCard />
    </div>
  );
}
