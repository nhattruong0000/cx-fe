"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials } from "@/lib/string-utils";

const schema = z.object({
  full_name: z.string().min(1, "Vui lòng nhập họ và tên"),
  email: z.string().email(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ProfilePersonalInfoCard() {
  const { data: profile } = useProfile();
  const storeUser = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();

  // Prefer fresh profile data from API, fall back to auth store
  const user = profile?.user ?? storeUser;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      email: user?.email ?? "",
      phone: "",
    },
  });

  // Sync form when profile data loads
  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name,
        email: user.email,
        phone: form.getValues("phone"),
      });
    }
  }, [user?.full_name, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  function onSubmit(values: FormValues) {
    updateProfile.mutate(
      { full_name: values.full_name, phone: values.phone },
      {
        onSuccess: () => toast.success("Cập nhật hồ sơ thành công"),
        onError: () => toast.error("Không thể cập nhật hồ sơ"),
      }
    );
  }

  return (
    <Card>
      <CardHeader className="px-5 pt-4 pb-2">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">Thông tin cá nhân</CardTitle>
        <CardDescription className="text-[13px] leading-normal">Cập nhật thông tin cá nhân và liên hệ của bạn.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="px-5 pt-1 pb-4 space-y-3">
            {/* Avatar + name/role display */}
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name} />}
                <AvatarFallback>{user ? getInitials(user.full_name) : "?"}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-[16px] font-semibold text-[#09090B]">{user?.full_name}</p>
                <Badge className="rounded-full">
                  {(user as { role?: string })?.role ?? "Admin"}
                </Badge>
              </div>
            </div>

            {/* Full Name + Email (2-col grid) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ email (chỉ đọc)</FormLabel>
                    <FormControl>
                      <Input type="email" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone — inside 2-col grid with empty spacer to keep balance */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+84 912 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div />
            </div>
          </CardContent>

          <CardFooter className="border-t border-[#E4E4E7] px-5 py-3 justify-end">
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Đang lưu…" : "Lưu thay đổi"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
