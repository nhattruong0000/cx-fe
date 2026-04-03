"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { useInviteUser, useAdminGroups, useAdminOrganizations } from "@/hooks/use-admin-users";
import { SearchableOrgSelect } from "@/components/admin/searchable-org-select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { SearchableGroupSelect } from "@/components/admin/searchable-group-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  organization_id: z.string().optional(),
  org_role: z.enum(["owner", "member"]).optional(),
}).refine(
  (data) => data.role !== "customer" || (data.organization_id && data.organization_id.length > 0),
  { message: "Vui lòng chọn tổ chức cho khách hàng", path: ["organization_id"] }
);

type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

const ROLE_OPTIONS = [
  { value: "admin" as const, label: "Quản trị viên" },
  { value: "staff" as const, label: "Nhân viên" },
  { value: "customer" as const, label: "Khách hàng" },
];

const ORG_ROLE_OPTIONS = [
  { value: "member" as const, label: "Thành viên" },
  { value: "owner" as const, label: "Chủ sở hữu" },
];

export function InviteUserForm() {
  const router = useRouter();
  const { mutate: inviteUser, isPending } = useInviteUser();
  const { data: groupsData } = useAdminGroups();
  const { data: orgsData } = useAdminOrganizations();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingValues, setPendingValues] = useState<InviteUserFormValues | null>(null);

  const form = useForm<InviteUserFormValues>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "staff",
      group_id: undefined,
      organization_id: undefined,
      org_role: "member",
    },
  });

  // Clear organization_id when role changes away from customer
  const watchedRole = form.watch("role");
  useEffect(() => {
    if (watchedRole !== "customer") {
      form.setValue("organization_id", undefined);
      form.setValue("org_role", "member");
    } else {
      form.setValue("group_id", undefined);
    }
  }, [watchedRole, form]);

  function onSubmit(values: InviteUserFormValues) {
    setPendingValues(values);
    setShowConfirm(true);
  }

  function handleConfirmInvite() {
    if (!pendingValues) return;
    setShowConfirm(false);
    inviteUser(
      {
        email: pendingValues.email,
        role: pendingValues.role,
        permission_group_id: pendingValues.group_id || undefined,
        organization_id: pendingValues.organization_id || undefined,
        org_role: pendingValues.role === "customer" ? (pendingValues.org_role || "member") : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Gửi lời mời thành công", {
            description: `Lời mời đã được gửi đến ${pendingValues.email}.`,
          });
          router.push("/users");
        },
        onError: () => {
          toast.error("Gửi lời mời thất bại", {
            description: "Đã xảy ra lỗi. Vui lòng thử lại.",
          });
        },
      }
    );
    setPendingValues(null);
  }

  return (
    <>
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

            {/* Organization — visible only for customer role */}
            {watchedRole === "customer" && (
              <FormField
                control={form.control}
                name="organization_id"
                render={({ field }) => (
                  <SearchableOrgSelect
                    value={field.value}
                    onChange={field.onChange}
                    organizations={(orgsData?.organizations ?? []).map((o) => ({
                      id: String(o.id),
                      name: o.name,
                      code: o.code,
                    }))}
                  />
                )}
              />
            )}

            {/* Organization Role — visible only for customer role */}
            {watchedRole === "customer" && (
              <FormField
                control={form.control}
                name="org_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vai trò trong tổ chức</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value ?? "member"}
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-3"
                      >
                        {ORG_ROLE_OPTIONS.map(({ value, label }) => (
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
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[#E4E4E7] transition-colors group-data-checked/radio-card:border-[3px] group-data-checked/radio-card:border-white group-data-checked/radio-card:bg-[#2556C5] group-data-checked/radio-card:shadow-[0_0_0_1px_#2556C5]">
                              <RadioPrimitive.Indicator>
                                <span className="block size-1.5 rounded-full bg-white" />
                              </RadioPrimitive.Indicator>
                            </span>
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
            )}

            {/* Permission Group — only for staff/admin */}
            {watchedRole !== "customer" && (
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
            )}

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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-[480px]" showCloseButton>
          <DialogHeader>
            <DialogTitle>Xác nhận gửi lời mời</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn gửi lời mời đến <strong>{pendingValues?.email}</strong> với vai trò{" "}
              <strong>
                {ROLE_OPTIONS.find((r) => r.value === pendingValues?.role)?.label}
              </strong>
              {pendingValues?.role === "customer" && pendingValues?.organization_id && (
                <>, tổ chức{" "}
                  <strong>
                    {orgsData?.organizations.find((o) => String(o.id) === pendingValues.organization_id)?.name}
                  </strong>
                </>
              )}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmInvite} disabled={isPending}>
              <Send className="size-4" />
              {isPending ? "Đang gửi..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
