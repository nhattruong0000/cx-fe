"use client";

import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from "@/hooks/use-profile";
import type { NotificationPreference } from "@/types/profile";

/** Fallback rows shown when the API returns no preferences or 404 */
const DEFAULT_PREFERENCES: NotificationPreference[] = [
  {
    key: "email_notifications",
    label: "Email Notifications",
    description: "Receive updates and alerts via email",
    type: "email",
    enabled: true,
  },
  {
    key: "sms_notifications",
    label: "SMS Notifications",
    description: "Receive text message alerts for important events",
    type: "sms",
    enabled: false,
  },
  {
    key: "marketing_emails",
    label: "Marketing Emails",
    description: "Receive product news, tips, and promotional offers",
    type: "email",
    enabled: false,
  },
];

export function ProfileNotificationPreferencesCard() {
  const { data, isLoading } = useNotificationPreferences();
  const updatePreference = useUpdateNotificationPreference();

  const isError = !isLoading && !data?.preferences?.length;

  // Use API data when available; fall back to read-only defaults on error/empty
  const preferences: NotificationPreference[] =
    data?.preferences?.length ? data.preferences : DEFAULT_PREFERENCES;

  function handleToggle(key: string, enabled: boolean) {
    updatePreference.mutate(
      { key, enabled },
      {
        onError: () => toast.error("Failed to update notification preference"),
      }
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>

      <CardContent className="pt-0 px-0">
        {isLoading ? (
          <div className="px-4 py-6 text-sm text-[#94A3B8]">Loading preferences…</div>
        ) : (
          <ul>
            {preferences.map((pref, idx) => (
              <li
                key={pref.key}
                className={`flex items-center justify-between px-4 py-4 ${
                  idx < preferences.length - 1 ? "border-b border-[#E4E4E7]" : ""
                }`}
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
        )}
      </CardContent>
    </Card>
  );
}
