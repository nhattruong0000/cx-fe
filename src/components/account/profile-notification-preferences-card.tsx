"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from "@/hooks/use-profile";
import type { NotificationPreference } from "@/types/profile";

/** Fallback rows shown when the API returns no preferences or 404 */
const DEFAULT_PREFERENCES: NotificationPreference[] = [
  {
    key: "email_notifications",
    label: "Thông báo email",
    description: "Nhận cập nhật qua email về hoạt động tài khoản.",
    type: "email",
    enabled: true,
  },
  {
    key: "push_notifications",
    label: "Thông báo đẩy",
    description: "Nhận thông báo đẩy tức thì trên thiết bị.",
    type: "push",
    enabled: false,
  },
];

export function ProfileNotificationPreferencesCard() {
  const { data, isLoading } = useNotificationPreferences();
  const updatePreference = useUpdateNotificationPreference();
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const isError = !isLoading && !data?.preferences?.length;

  // Use API data when available; fall back to read-only defaults on error/empty
  const preferences: NotificationPreference[] =
    data?.preferences?.length ? data.preferences : DEFAULT_PREFERENCES;

  function handleToggle(key: string, enabled: boolean) {
    updatePreference.mutate(
      { key, enabled },
      {
        onError: () => toast.error("Không thể cập nhật tùy chọn thông báo"),
      }
    );
  }

  return (
    <Card>
      <CardHeader className="px-5 pt-4 pb-2">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">Tùy chọn thông báo</CardTitle>
        <CardDescription className="text-[13px] leading-normal">Chọn cách bạn muốn nhận thông báo.</CardDescription>
      </CardHeader>

      <CardContent className="px-5 pt-1 pb-4">
        {isLoading ? (
          <div className="py-6 text-sm text-[#94A3B8]">Đang tải tùy chọn…</div>
        ) : (
          <>
            <ul className="space-y-3">
              {preferences.map((pref) => (
                <li
                  key={pref.key}
                  className="flex items-center justify-between py-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-[#09090B]">{pref.label}</p>
                    <p className="text-xs text-[#71717A]">{pref.description}</p>
                  </div>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={(checked) => handleToggle(pref.key, checked)}
                    disabled={isError || updatePreference.isPending}
                    aria-label={pref.label}
                  />
                </li>
              ))}
            </ul>

            {/* Separator */}
            <div className="h-px w-full bg-[#E4E4E7]" />

            {/* Weekly digest checkbox row */}
            <div className="flex items-center gap-2 py-3">
              <Checkbox
                id="weekly-digest"
                checked={weeklyDigest}
                onCheckedChange={(checked) => setWeeklyDigest(checked === true)}
              />
              <label
                htmlFor="weekly-digest"
                className="text-sm text-[#09090B] cursor-pointer"
              >
                <span className="font-medium">Tổng hợp hàng tuần</span>
                {" — "}
                <span className="text-[#71717A]">Nhận tóm tắt hoạt động mỗi tuần</span>
              </label>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
