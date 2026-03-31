"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
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
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account with an authenticator app.
        </CardDescription>
        <CardAction>
          {isEnabled ? (
            <Badge variant="success">Enabled</Badge>
          ) : (
            <Badge variant="destructive">Not Enabled</Badge>
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-[#71717A]">
          {isEnabled
            ? "Two-factor authentication is active. Your account is protected with a time-based one-time password (TOTP) from your authenticator app."
            : "Protect your account by requiring a verification code from your authenticator app (e.g. Google Authenticator, Authy) each time you sign in."}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          variant={isEnabled ? "destructive" : "default"}
          onClick={handleToggle}
          disabled={isPending || isError}
        >
          {isPending
            ? isEnabled
              ? "Disabling..."
              : "Enabling..."
            : isEnabled
              ? "Disable 2FA"
              : "Enable 2FA"}
        </Button>
      </CardFooter>
    </Card>
  );
}
