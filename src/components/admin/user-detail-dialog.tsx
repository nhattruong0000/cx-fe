"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateUser } from "@/hooks/use-admin-users";
import { usePermissionGroups } from "@/hooks/use-admin-groups";
import type { AdminUser } from "@/types/admin";

interface UserDetailDialogProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function UserDetailDialog({ user, onClose }: UserDetailDialogProps) {
  const { data: groups } = usePermissionGroups();
  const updateMut = useUpdateUser();
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  // Sync state when user changes
  const currentGroupIds = user?.groups.map((g) => g.id) || [];
  if (user && selectedGroupIds.length === 0 && currentGroupIds.length > 0) {
    setSelectedGroupIds(currentGroupIds);
  }

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateMut.mutateAsync({
        id: user.id,
        data: {
          permission_group_ids: selectedGroupIds,
          extra_permissions: user.extra_permissions,
        },
      });
      toast.success("Cập nhật thành công");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cập nhật thất bại");
    }
    setSaving(false);
  };

  const handleClose = () => {
    setSelectedGroupIds([]);
    onClose();
  };

  if (!user) return null;

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={!!user} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1 flex gap-1">
                <Badge variant="secondary">{user.role}</Badge>
                <Badge
                  variant={user.status === "active" ? "default" : "destructive"}
                >
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          {groups && groups.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Nhóm quyền</p>
              <div className="space-y-2">
                {groups
                  .filter(
                    (g) =>
                      g.scope === "both" || g.scope === user.role
                  )
                  .map((group) => (
                    <label
                      key={group.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedGroupIds.includes(group.id)}
                        onCheckedChange={(checked) => {
                          setSelectedGroupIds((prev) =>
                            checked
                              ? [...prev, group.id]
                              : prev.filter((id) => id !== group.id)
                          );
                        }}
                      />
                      {group.name}
                    </label>
                  ))}
              </div>
            </div>
          )}

          {user.organizations.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Tổ chức</p>
              {user.organizations.map((org) => (
                <div key={org.id} className="flex items-center gap-2 text-sm">
                  <span>{org.name}</span>
                  <Badge variant="outline">{org.org_role}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Đóng
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
