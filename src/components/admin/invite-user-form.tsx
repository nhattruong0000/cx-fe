"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { useInviteUser, useAdminGroups } from "@/hooks/use-admin-users";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { SearchableGroupSelect } from "@/components/admin/searchable-group-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "@/lib/utils";

// Zod schema for invite user form
const inviteUserSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  role: z.enum(["admin", "staff", "customer"]),
  group_id: z.string().optional(),
});

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

const ROLE_OPTIONS = [
  { value: "admin" as const, label: "Quản trị viên" },
  { value: "staff" as const, label: "Nhân viên" },
  { value: "customer" as const, label: "Khách hàng" },
];

export function InviteUserForm() {
  const router = useRouter();
  const { mutate: inviteUser, isPending } = useInviteUser();
  const { data: groupsData } = useAdminGroups();

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "staff",
      group_id: undefined,
    },
  });

  function onSubmit(values: InviteUserFormValues) {
    inviteUser(
      {
        email: values.email,
        role: values.role,
        permission_group_id: values.group_id || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Đã gửi lời mời đến ${values.email}`);
          router.push("/users");
        },
        onError: () => {
          toast.error("Gửi lời mời thất bại. Vui lòng thử lại.");
        },
      }
    );
  }

  return (
    <Card className="w-[560px] rounded-[14px]">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="colleague@company.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Lời mời sẽ được gửi đến địa chỉ email này.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role — simple radio list per design */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <FormDescription>Chọn vai trò cho người dùng được mời.</FormDescription>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="grid grid-cols-3 gap-3"
                    >
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <RadioPrimitive.Root
                          key={value}
                          value={value}
                          className={cn(
                            "group/radio-card flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border px-4 h-11 text-left transition-colors outline-none",
                            "border-[#E4E4E7] bg-white hover:bg-[#F8FAFC]",
                            "data-checked:border-2 data-checked:border-[#2556C5] data-checked:bg-[#EBF0FA]",
                            "focus-visible:ring-2 focus-visible:ring-[#2556C5]/20 focus-visible:border-[#2556C5]"
                          )}
                        >
                          {/* Radio circle */}
                          <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#E4E4E7] transition-colors group-data-checked/radio-card:border-[3px] group-data-checked/radio-card:border-white group-data-checked/radio-card:bg-[#2556C5] group-data-checked/radio-card:shadow-[0_0_0_1px_#2556C5]">
                            <RadioPrimitive.Indicator>
                              <span className="block size-1.5 rounded-full bg-white" />
                            </RadioPrimitive.Indicator>
                          </span>
                          {/* Label only */}
                          <span className="text-sm text-[#09090B] group-data-checked/radio-card:text-[#2556C5] group-data-checked/radio-card:font-medium">
                            {label}
                          </span>
                        </RadioPrimitive.Root>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permission Group */}
            <FormField
              control={form.control}
              name="group_id"
              render={({ field }) => (
                <SearchableGroupSelect
                  value={field.value}
                  onChange={field.onChange}
                  groups={(groupsData?.groups ?? []).map((g) => ({
                    id: String(g.id),
                    name: g.name,
                  }))}
                />
              )}
            />

            {/* Divider + Actions */}
            <div className="h-px w-full bg-[#E4E4E7]" />
            <div className="flex items-center justify-between">
              <Link
                href="/users"
                className="inline-flex h-10 items-center justify-center rounded-[10px] px-4 py-2.5 text-sm text-[#71717A] transition-colors hover:bg-muted"
              >
                Quay lại danh sách
              </Link>
              <Button type="submit" disabled={isPending} className="shadow-[0_2px_4px_#2556C520,0_8px_20px_#2556C525]">
                <Send className="size-4" />
                {isPending ? "Đang gửi..." : "Gửi lời mời"}
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
