"use client";

import { SecurityActiveSessionsCard } from "@/components/account/security-active-sessions-card";
import { SecurityPasswordCard } from "@/components/account/security-password-card";
import { SecurityTwoFactorCard } from "@/components/account/security-two-factor-card";

/** Security & Sessions page — 2FA, active sessions, and password management */
export default function SecurityPage() {
  return (
    <div className="max-w-[800px] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#09090B]">
          Security &amp; Sessions
        </h1>
        <p className="mt-1 text-sm text-[#71717A]">
          Manage your account security settings, active sessions, and password.
        </p>
      </div>

      <SecurityTwoFactorCard />
      <SecurityActiveSessionsCard />
      <SecurityPasswordCard />
    </div>
  );
}
