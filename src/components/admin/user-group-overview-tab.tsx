"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateGroup } from "@/hooks/use-admin-groups";
import type { PermissionGroup } from "@/types/admin";

interface Props {
  group: PermissionGroup;
}

export function UserGroupOverviewTab({ group }: Props) {
  const updateGroup = useUpdateGroup();
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);

  useEffect(() => {
    setName(group.name);
    setDescription(group.description);
  }, [group]);

  const handleSave = async () => {
    try {
      await updateGroup.mutateAsync({
        id: group.id,
        data: { name, description },
      });
      toast.success("Da cap nhat nhom");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cap nhat that bai");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thong tin nhom</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Badge variant="secondary">{group.scope}</Badge>
          <Badge variant="outline">{group.member_count} thanh vien</Badge>
          <Badge variant="outline">{group.permissions.length} quyen</Badge>
        </div>

        <div className="space-y-1.5">
          <Label>Ten nhom</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Mo ta</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={updateGroup.isPending}>
          {updateGroup.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Dang luu...
            </>
          ) : (
            "Luu thay doi"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
