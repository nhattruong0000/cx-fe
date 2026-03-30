"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api/client";

export function ProfilePageContent() {
  const user = useAuthStore((s) => s.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  if (!user) return null;

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Mật khẩu tối thiểu 8 ký tự");
      return;
    }
    setChanging(true);
    try {
      await apiClient.patch("/api/v1/auth/password", {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    }
    setChanging(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thông tin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.full_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Đổi mật khẩu</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="old-pw">Mật khẩu hiện tại</Label>
              <Input
                id="old-pw"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">Mật khẩu mới</Label>
              <Input
                id="new-pw"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pw">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirm-pw"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={changing}>
              {changing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Đổi mật khẩu
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Org Memberships (customer) */}
      {user.organizations && user.organizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tổ chức</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.organizations.map((org) => (
                <div key={org.id} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{org.organization_name}</span>
                  <Badge variant="outline">{org.org_role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
