"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuthStore } from "@/stores/auth-store"
import { accountApi } from "@/lib/api/account"

const profileSchema = z.object({
  full_name: z.string().min(1, "Họ tên không được để trống"),
  phone: z.string().optional(),
  timezone: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const TIMEZONES = [
  { value: "Asia/Ho_Chi_Minh", label: "Việt Nam (UTC+7)" },
  { value: "Asia/Tokyo", label: "Nhật Bản (UTC+9)" },
  { value: "Asia/Singapore", label: "Singapore (UTC+8)" },
  { value: "America/New_York", label: "New York (UTC-5)" },
  { value: "Europe/London", label: "London (UTC+0)" },
]

export function ProfileForm() {
  const user = useAuthStore((s) => s.user)
  const fetchMe = useAuthStore((s) => s.fetchMe)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      phone: "",
      timezone: "Asia/Ho_Chi_Minh",
    },
  })

  const selectedTimezone = watch("timezone")

  async function onSubmit(data: ProfileFormData) {
    try {
      await accountApi.updateProfile(data)
      await fetchMe()
      toast.success("Cập nhật hồ sơ thành công")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Cập nhật thất bại"
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user?.email ?? ""}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Email không thể thay đổi
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Họ tên</Label>
        <Input id="full_name" {...register("full_name")} />
        {errors.full_name && (
          <p className="text-xs text-error">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input id="phone" type="tel" {...register("phone")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Múi giờ</Label>
        <Select
          value={selectedTimezone}
          onValueChange={(v) => { if (v) setValue("timezone", v) }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn múi giờ" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Lưu thay đổi
        </Button>
      </div>
    </form>
  )
}
