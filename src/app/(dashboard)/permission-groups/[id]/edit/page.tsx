"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { toast } from "sonner"

import { useAuthStore } from "@/stores/auth-store"
import { useAdminGroups, useUpdateGroup } from "@/hooks/use-admin-users"
import { Button } from "@/components/ui/button"
import { PermissionGroupForm, type PermissionGroupFormValues } from "@/components/admin/permission-group-form"

export default function EditPermissionGroupPage() {
  const router = useRouter()
  const params = useParams()
  const groupId = Number(params.id)

  const authUser = useAuthStore((s) => s.user)
  const updateGroup = useUpdateGroup()

  // Admin-only guard
  React.useEffect(() => {
    if (authUser && authUser.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [authUser, router])

  const { data, isLoading } = useAdminGroups()
  const group = data?.groups.find((g) => g.id === groupId) ?? null

  const handleSubmit = (values: PermissionGroupFormValues) => {
    if (!group) return

    updateGroup.mutate(
      {
        id: group.id,
        data: {
          name: values.name,
          description: values.description,
          permissions: values.permissions,
        },
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật nhóm quyền hạn thành công")
          router.push("/permission-groups")
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Cập nhật nhóm thất bại"
          toast.error(message)
        },
      }
    )
  }

  if (authUser && authUser.role !== "admin") return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-[#71717A]">
        Đang tải...
      </div>
    )
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-[#71717A]">Không tìm thấy nhóm quyền hạn.</p>
        <Link
          href="/permission-groups"
          className="text-sm text-primary hover:underline"
        >
          Quay lại danh sách
        </Link>
      </div>
    )
  }

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
          <h1 className="text-2xl font-semibold text-[#09090B]">Sửa nhóm quyền hạn</h1>
          <p className="text-sm text-[#71717A]">{group.name}</p>
        </div>

        {/* Action buttons — trigger the form by id */}
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/permission-groups")}>
            Hủy
          </Button>
          <Button
            type="submit"
            form="permission-group-form"
            disabled={updateGroup.isPending}
          >
            {updateGroup.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      <PermissionGroupForm
        defaultValues={{
          name: group.name,
          description: group.description ?? "",
          permissions: group.permissions,
        }}
        onSubmit={handleSubmit}
        isPending={updateGroup.isPending}
      />
    </div>
  )
}
