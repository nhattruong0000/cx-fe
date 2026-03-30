"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateGroup, useUpdateGroup } from "@/hooks/use-admin-groups";
import { PERMISSION_CATEGORIES } from "@/types/admin";
import type { PermissionGroup } from "@/types/admin";

const groupSchema = z.object({
  name: z.string().min(1, "Tên nhóm là bắt buộc"),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGroup?: PermissionGroup | null;
}

export function GroupFormDialog({
  open,
  onOpenChange,
  editGroup,
}: GroupFormDialogProps) {
  const createMut = useCreateGroup();
  const updateMut = useUpdateGroup();
  const [scope, setScope] = useState<"staff" | "customer" | "both">("staff");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
  });

  useEffect(() => {
    if (editGroup) {
      reset({ name: editGroup.name, description: editGroup.description });
      setScope(editGroup.scope);
      setSelectedPerms(editGroup.permissions);
    } else {
      reset({ name: "", description: "" });
      setScope("staff");
      setSelectedPerms([]);
    }
  }, [editGroup, reset]);

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const onSubmit = async (data: GroupFormValues) => {
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        scope,
        permissions: selectedPerms,
      };
      if (editGroup) {
        await updateMut.mutateAsync({ id: editGroup.id, data: payload });
        toast.success("Cập nhật nhóm thành công");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Tạo nhóm thành công");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Thao tác thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editGroup ? "Sửa nhóm quyền" : "Tạo nhóm quyền"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Tên nhóm</Label>
            <Input id="group-name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="group-desc">Mô tả</Label>
            <Textarea id="group-desc" rows={2} {...register("description")} />
          </div>
          <div className="space-y-2">
            <Label>Phạm vi</Label>
            <Select value={scope} onValueChange={(v) => { if (v) setScope(v as typeof scope); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="both">Cả hai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Quyền hạn</Label>
            {Object.entries(PERMISSION_CATEGORIES).map(([category, perms]) => (
              <div key={category} className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  {category}
                </p>
                <div className="space-y-1">
                  {perms.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={selectedPerms.includes(perm)}
                        onCheckedChange={() => togglePerm(perm)}
                      />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
                  Đang lưu...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
