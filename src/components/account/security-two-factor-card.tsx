"use client";

import { ShieldCheck, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { use2FAStatus, useDisable2FA, useEnable2FA } from "@/hooks/use-profile";

/** Displays Two-Factor Authentication status and toggle controls */
export function SecurityTwoFactorCard() {
  const { data, isError } = use2FAStatus();
  const enable2FA = useEnable2FA();
  const disable2FA = useDisable2FA();

  // Treat 404 / errors as "not enabled" — graceful degradation
  const isEnabled = !isError && data?.enabled === true;

  function handleToggle() {
    if (isEnabled) {
      disable2FA.mutate(undefined);
    } else {
      enable2FA.mutate("totp");
    }
  }

  const isPending = enable2FA.isPending || disable2FA.isPending;

  return (
    <Card>
      <CardHeader className="px-6 pt-4 pb-3 space-y-1.5">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">
          Xác thực hai yếu tố
        </CardTitle>
        <CardDescription className="text-[13px] leading-normal">
          Thêm lớp bảo mật cho tài khoản bằng cách bật xác thực hai yếu tố.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-2">
        {/* Status row */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#09090B]">Trạng thái</span>
          {isEnabled ? (
            <Badge variant="success" className="rounded-full">Đã bật</Badge>
          ) : (
            <Badge variant="outline" className="rounded-full">Chưa bật</Badge>
          )}
        </div>

        {/* Info section with smartphone icon */}
        <div className="flex gap-2 mt-4">
          <Smartphone className="h-4 w-4 shrink-0 text-[#71717A] mt-0.5" />
          <p className="text-[13px] leading-normal text-[#71717A]">
            Sử dụng ứng dụng xác thực như Google Authenticator hoặc Authy để tạo mã xác minh.
          </p>
        </div>
      </CardContent>

      <CardFooter className="px-6 pt-3 pb-4 border-t border-[#E4E4E7] justify-end">
        <Button
          variant="outline"
          onClick={handleToggle}
          disabled={isPending || isError}
        >
          <ShieldCheck className="h-4 w-4" />
          {isPending
            ? isEnabled
              ? "Đang tắt..."
              : "Đang bật..."
            : isEnabled
              ? "Tắt 2FA"
              : "Bật 2FA"}
        </Button>
      </CardFooter>
    </Card>
  );
}
