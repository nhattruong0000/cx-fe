"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useInviteUser } from "@/hooks/use-admin-users";
import { usePermissionGroups } from "@/hooks/use-admin-groups";
import type { UserRole } from "@/types/common";

const inviteSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["staff", "customer"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const inviteMut = useInviteUser();
  const { data: groups } = usePermissionGroups();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: "staff" },
  });

  const selectedRole = watch("role");
  const selectedGroupIds: number[] = [];

  const onSubmit = async (data: InviteFormValues) => {
    try {
      await inviteMut.mutateAsync({
        email: data.email,
        role: data.role as UserRole,
        permission_group_ids: selectedGroupIds,
      });
      toast.success(`Lời mời đã gửi đến ${data.email}`);
      reset();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gửi lời mời thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mời người dùng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="email@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Vai trò</Label>
            <Select
              value={selectedRole}
              onValueChange={(val) => { if (val) setValue("role", val as "staff" | "customer"); }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Nhân viên</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {groups && groups.length > 0 && (
            <div className="space-y-2">
              <Label>Nhóm quyền</Label>
              <div className="space-y-2">
                {groups
                  .filter(
                    (g) =>
                      g.scope === "both" || g.scope === selectedRole
                  )
                  .map((group) => (
                    <label
                      key={group.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        onCheckedChange={(checked) => {
                          if (checked) {
                            selectedGroupIds.push(group.id);
                          } else {
                            const idx = selectedGroupIds.indexOf(group.id);
                            if (idx >= 0) selectedGroupIds.splice(idx, 1);
                          }
                        }}
                      />
                      {group.name}
                    </label>
                  ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi lời mời"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
