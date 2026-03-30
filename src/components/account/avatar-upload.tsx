"use client"

import { useRef, useState } from "react"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { accountApi } from "@/lib/api/account"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function AvatarUpload() {
  const user = useAuthStore((s) => s.user)
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Chỉ chấp nhận định dạng JPEG, PNG, hoặc WebP")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Kích thước ảnh tối đa 5MB")
      return
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    setIsUploading(true)
    try {
      await accountApi.uploadAvatar(file)
      await fetchMe()
      toast.success("Cập nhật ảnh đại diện thành công")
    } catch (err) {
      setPreviewUrl(null)
      const message =
        err instanceof Error ? err.message : "Upload thất bại"
      toast.error(message)
    } finally {
      setIsUploading(false)
      URL.revokeObjectURL(objectUrl)
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="size-20">
          {/* avatar_url comes from API but not yet in User type — safe cast */}
          <AvatarImage src={previewUrl ?? (user as unknown as { avatar_url?: string })?.avatar_url ?? undefined} alt={user?.full_name} />
          <AvatarFallback className="text-lg">
            {user?.full_name ? getInitials(user.full_name) : "?"}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <Loader2 className="size-5 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="mr-1.5 size-4" />
          Đổi ảnh đại diện
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG hoặc WebP. Tối đa 5MB.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
