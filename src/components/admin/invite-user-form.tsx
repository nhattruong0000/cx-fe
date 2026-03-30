"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInviteUser } from "@/hooks/use-admin-users";
import { usePermissionGroups } from "@/hooks/use-admin-groups";
import type { UserRole } from "@/types/common";

const inviteSchema = z.object({
  email: z.string().email("Email khong hop le"),
  role: z.enum(["admin", "staff", "customer"] as const),
  permission_group_ids: z.array(z.number()),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export function InviteUserForm() {
  const router = useRouter();
  const inviteUser = useInviteUser();
  const { data: groups } = usePermissionGroups();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: "staff", permission_group_ids: [] },
  });

  const selectedRole = watch("role");
  const selectedGroupIds = watch("permission_group_ids");

  const onSubmit = async (data: InviteFormData) => {
    try {
      await inviteUser.mutateAsync(data);
      toast.success("Da gui loi moi thanh cong");
      router.push("/users");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gui loi moi that bai");
    }
  };

  const toggleGroup = (groupId: number) => {
    const current = selectedGroupIds;
    const next = current.includes(groupId)
      ? current.filter((id) => id !== groupId)
      : [...current, groupId];
    setValue("permission_group_ids", next);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thong tin loi moi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              disabled={isSubmitting}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Vai tro</Label>
            <Select
              value={selectedRole}
              onValueChange={(val) => setValue("role", val as UserRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chon vai tro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {groups && groups.length > 0 && (
            <div className="space-y-2">
              <Label>Nhom quyen</Label>
              <div className="space-y-2 rounded-lg border p-3">
                {groups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedGroupIds.includes(group.id)}
                      onCheckedChange={() => toggleGroup(group.id)}
                    />
                    <span className="text-sm">{group.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({group.member_count} thanh vien)
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Dang gui...
                </>
              ) : (
                "Gui loi moi"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/users")}
            >
              Huy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
