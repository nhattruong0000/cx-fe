"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAuthStore } from "@/stores/auth-store";
import type { InvitationValidation } from "@/types/auth";

const inviteSchema = z
  .object({
    full_name: z.string().min(2, "Họ tên tối thiểu 2 ký tự"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["password_confirmation"],
  });

type InviteForm = z.infer<typeof inviteSchema>;

export default function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();
  const [invitation, setInvitation] = useState<InvitationValidation | null>(
    null
  );
  const [validating, setValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  useEffect(() => {
    authApi
      .validateInvitation(code)
      .then((data) => {
        if (data.status === "accepted") {
          toast.info("Bạn đã tạo tài khoản. Hãy đăng nhập.");
          router.push("/login");
          return;
        }
        setInvitation(data);
      })
      .catch(() => {
        setInvitation({
          status: "invalid",
          email: "",
          role: "customer",
          inviter_name: "",
          expires_at: "",
        });
      })
      .finally(() => setValidating(false));
  }, [code, router]);

  const onSubmit = async (data: InviteForm) => {
    try {
      const response = await authApi.acceptInvitation(code, data);
      localStorage.setItem("cx-token", response.tokens.access_token);
      localStorage.setItem("cx-refresh-token", response.tokens.refresh_token);
      document.cookie = "cx-auth=true; path=/; max-age=86400; SameSite=Lax";
      document.cookie = `cx-role=${response.user.role}; path=/; max-age=86400; SameSite=Lax`;
      await useAuthStore.getState().fetchMe();
      toast.success("Tạo tài khoản thành công!");
      router.push(response.user.role === "customer" ? "/customer" : "/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Tạo tài khoản thất bại"
      );
    }
  };

  if (validating) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!invitation || invitation.status === "invalid") {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-[28px] font-bold text-foreground">
          Lời mời không hợp lệ
        </h1>
        <p className="text-sm text-muted-foreground">
          Lời mời này không tồn tại hoặc đã bị hủy.
        </p>
      </div>
    );
  }

  if (invitation.status === "expired") {
    return (
      <div className="space-y-2 text-center">
        <h1 className="text-[28px] font-bold text-foreground">
          Lời mời đã hết hạn
        </h1>
        <p className="text-sm text-muted-foreground">
          Liên hệ quản trị viên để được gửi lại lời mời.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold text-foreground">Chào mừng!</h1>
        <p className="text-sm text-muted-foreground">
          Bạn được mời bởi {invitation.inviter_name}
          {invitation.organization_name &&
            ` tham gia ${invitation.organization_name}`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={invitation.email} disabled className="opacity-60" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="full_name">Họ và tên</Label>
          <Input
            id="full_name"
            placeholder="Nhập họ và tên..."
            disabled={isSubmitting}
            {...register("full_name")}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Mật khẩu</Label>
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
              Đang tạo...
            </>
          ) : (
            "Tạo tài khoản"
          )}
        </Button>
      </form>
    </div>
  );
}
