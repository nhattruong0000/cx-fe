"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authApi } from "@/lib/api/auth";

const resetSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [tokenStatus, setTokenStatus] = useState<
    "loading" | "valid" | "expired" | "invalid"
  >("loading");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    authApi
      .validateResetToken(token)
      .then((data) => setTokenStatus(data.valid ? "valid" : data.status))
      .catch(() => setTokenStatus("invalid"));
  }, [token]);

  const onSubmit = async (data: ResetForm) => {
    try {
      await authApi.resetPassword({
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      toast.success("Mật khẩu đã được đổi thành công");
      router.push("/login");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Đặt lại mật khẩu thất bại"
      );
    }
  };

  if (tokenStatus === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (tokenStatus === "expired") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Link đã hết hạn
        </h1>
        <p className="text-sm text-muted-foreground">
          Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu link mới.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Yêu cầu link mới
        </Link>
      </div>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Link không hợp lệ
        </h1>
        <p className="text-sm text-muted-foreground">
          Link đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Yêu cầu link mới
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Đặt mật khẩu mới
        </h1>
        <p className="text-sm text-muted-foreground">
          Tạo mật khẩu mới cho tài khoản của bạn
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="password">Mật khẩu mới</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Tối thiểu 8 ký tự"
              className="pl-10 pr-10"
              disabled={isSubmitting}
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="pl-10"
              disabled={isSubmitting}
              {...register("password_confirmation")}
            />
          </div>
          {errors.password_confirmation && (
            <p className="text-sm text-destructive">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Đặt mật khẩu"
          )}
        </Button>
      </form>
    </div>
  );
}
