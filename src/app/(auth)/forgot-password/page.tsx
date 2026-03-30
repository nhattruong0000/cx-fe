"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth";

const forgotSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  });

  const startCooldown = () => {
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = async (data: ForgotForm) => {
    try {
      await authApi.forgotPassword(data.email);
    } catch {
      // Always show success to not leak email existence
    }
    setSentEmail(data.email);
    setSent(true);
    startCooldown();
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      await authApi.forgotPassword(sentEmail);
      toast.success("Đã gửi lại email");
    } catch {
      // silent
    }
    startCooldown();
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Kiểm tra email
          </h1>
          <p className="text-sm text-muted-foreground">
            Chúng tôi đã gửi link đặt lại mật khẩu đến {sentEmail}.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Không nhận được?{" "}
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-primary hover:underline disabled:opacity-50"
          >
            {cooldown > 0 ? `Gửi lại (${cooldown}s)` : "Gửi lại"}
          </button>
        </p>
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Quên mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground">
          Nhập email để nhận link đặt lại mật khẩu
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="pl-10"
              disabled={isSubmitting}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi link"
          )}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
