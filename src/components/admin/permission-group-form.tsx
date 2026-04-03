"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Label } from "@/components/ui/label"
import { PermissionGrid } from "@/components/admin/permission-grid"

const schema = z.object({
  name: z.string().min(1, "Tên nhóm không được để trống"),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, "Chọn ít nhất một quyền hạn"),
})

export type PermissionGroupFormValues = z.infer<typeof schema>

interface PermissionGroupFormProps {
  defaultValues?: Partial<PermissionGroupFormValues>
  onSubmit: (values: PermissionGroupFormValues) => void
  isPending: boolean
  /** Render prop for submit/cancel buttons — form id is "permission-group-form" */
  formId?: string
}

/** Shared create/edit form — parent is responsible for buttons using formId */
export function PermissionGroupForm({
  defaultValues,
  onSubmit,
  isPending,
  formId = "permission-group-form",
}: PermissionGroupFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PermissionGroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      permissions: defaultValues?.permissions ?? [],
    },
  })

  const permissions = watch("permissions")

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
      aria-busy={isPending}
    >
      {/* Name field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="group-name">
          Tên nhóm <span className="text-destructive">*</span>
        </Label>
        <input
          id="group-name"
          type="text"
          placeholder="Nhập tên nhóm quyền hạn..."
          className="h-10 w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20 aria-invalid:border-destructive"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="group-description">Mô tả</Label>
        <textarea
          id="group-description"
          rows={3}
          placeholder="Mô tả ngắn về nhóm quyền hạn này..."
          className="w-full rounded-[10px] border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#09090B] placeholder:text-[#94A3B8] outline-none focus:border-[#2556C5] focus:ring-2 focus:ring-[#2556C5]/20 resize-none"
          {...register("description")}
        />
      </div>

      {/* Permission grid */}
      <div className="flex flex-col gap-3">
        <div>
          <Label>Quyền hạn <span className="text-destructive">*</span></Label>
          <p className="text-xs text-[#71717A] mt-0.5">Chọn các quyền hạn cho nhóm này</p>
        </div>
        <PermissionGrid
          value={permissions}
          onChange={(perms) => setValue("permissions", perms, { shouldValidate: true })}
        />
        {errors.permissions && (
          <p className="text-xs text-destructive">{errors.permissions.message}</p>
        )}
      </div>
    </form>
  )
}
