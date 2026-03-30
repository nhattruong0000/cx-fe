"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GroupCard } from "@/components/admin/group-card";
import { GroupFormDialog } from "@/components/admin/group-form-dialog";
import { usePermissionGroups, useDeleteGroup } from "@/hooks/use-admin-groups";
import type { PermissionGroup } from "@/types/admin";

export default function GroupsSettingsPage() {
  const { data: groups, isLoading } = usePermissionGroups();
  const deleteMut = useDeleteGroup();
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<PermissionGroup | null>(null);
  const [deleteGroup, setDeleteGroup] = useState<PermissionGroup | null>(null);

  const handleEdit = (group: PermissionGroup) => {
    setEditGroup(group);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteGroup) return;
    try {
      await deleteMut.mutateAsync(deleteGroup.id);
      toast.success(`Đã xóa nhóm ${deleteGroup.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xóa thất bại");
    }
    setDeleteGroup(null);
  };

  const handleFormClose = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditGroup(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditGroup(null); setFormOpen(true); }}>
          <Plus className="mr-1 h-4 w-4" />
          Tạo nhóm
        </Button>
      </div>

      {(!groups || groups.length === 0) ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            Chưa có nhóm quyền nào. Tạo nhóm đầu tiên.
          </p>
          <Button className="mt-4" onClick={() => setFormOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Tạo nhóm
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
              onDelete={setDeleteGroup}
            />
          ))}
        </div>
      )}

      <GroupFormDialog
        open={formOpen}
        onOpenChange={handleFormClose}
        editGroup={editGroup}
      />

      <Dialog open={!!deleteGroup} onOpenChange={() => setDeleteGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa nhóm quyền</DialogTitle>
            <DialogDescription>
              Xóa nhóm &quot;{deleteGroup?.name}&quot; sẽ gỡ quyền khỏi{" "}
              {deleteGroup?.member_count} thành viên. Tiếp tục?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteGroup(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
