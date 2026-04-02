"use client";

import { SecurityActiveSessionsCard } from "@/components/account/security-active-sessions-card";
import { SecurityPasswordCard } from "@/components/account/security-password-card";
import { SecurityTwoFactorCard } from "@/components/account/security-two-factor-card";

/** Security & Sessions page — 2FA, active sessions, and password management */
export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#09090B]">
          Bảo mật &amp; Phiên đăng nhập
        </h1>
      </div>

      <SecurityTwoFactorCard />
      <SecurityActiveSessionsCard />
      <SecurityPasswordCard />
    </div>
  );
}
