"use client";

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
import { useChangePassword } from "@/hooks/use-profile";

const schema = z
  .object({
    current_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    new_password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    new_password_confirmation: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["new_password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export function ProfileChangePasswordCard() {
  const changePassword = useChangePassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  function onSubmit(values: FormValues) {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Cập nhật mật khẩu thành công");
        form.reset();
      },
      onError: (err: unknown) => {
        const message =
          (err as { message?: string })?.message ?? "Không thể cập nhật mật khẩu";
        toast.error(message);
      },
    });
  }

  return (
    <Card>
      <CardHeader className="px-5 pt-4 pb-2">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">Đổi mật khẩu</CardTitle>
        <CardDescription className="text-[13px] leading-normal">Đảm bảo tài khoản được an toàn bằng cách đổi mật khẩu thường xuyên.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="px-5 pt-1 pb-4 space-y-3">
            {/* Current password — full width */}
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu hiện tại</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New password + confirmation — 2-col grid */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="new_password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-[#E4E4E7] px-5 py-3 justify-end">
            <Button type="submit" disabled={changePassword.isPending}>
              {changePassword.isPending ? "Đang cập nhật…" : "Cập nhật mật khẩu"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
