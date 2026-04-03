"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { toast } from "sonner"

import { useAuthStore } from "@/stores/auth-store"
import { useCreateGroup } from "@/hooks/use-admin-users"
import { Button } from "@/components/ui/button"
import { PermissionGroupForm, type PermissionGroupFormValues } from "@/components/admin/permission-group-form"

export default function CreatePermissionGroupPage() {
  const router = useRouter()
  const authUser = useAuthStore((s) => s.user)
  const createGroup = useCreateGroup()

  // Admin-only guard
  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [authUser, router])

  const handleSubmit = (values: PermissionGroupFormValues) => {
    createGroup.mutate(
      {
        name: values.name,
        description: values.description,
        scope: "staff",
        permissions: values.permissions,
      },
      {
        onSuccess: () => {
          toast.success("Tạo nhóm quyền hạn thành công")
          router.push("/permission-groups")
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Tạo nhóm thất bại"
          toast.error(message)
        },
      }
    )
  }

  if (authUser && authUser.role !== "admin") return null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/permission-groups"
            className="inline-flex items-center gap-1.5 text-sm text-[#71717A] hover:text-[#09090B] transition-colors w-fit"
          >
            <ArrowLeftIcon className="size-3.5" />
            Quay lại
          </Link>
          <h1 className="text-2xl font-semibold text-[#09090B]">Tạo nhóm quyền hạn mới</h1>
          <p className="text-sm text-[#71717A]">Điền thông tin và chọn quyền hạn cho nhóm mới.</p>
        </div>

        {/* Action buttons — trigger the form by id */}
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/permission-groups")}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="permission-group-form"
            disabled={createGroup.isPending}
          >
            {createGroup.isPending ? "Đang lưu..." : "Lưu nhóm"}
          </Button>
        </div>
      </div>

      <PermissionGroupForm
        onSubmit={handleSubmit}
        isPending={createGroup.isPending}
      />
    </div>
  )
}
