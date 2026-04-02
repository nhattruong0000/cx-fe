import type { StrengthLevel } from "@/components/ui/progress"

const STRENGTH_LABELS: Record<StrengthLevel, string> = {
  0: "",
  1: "Yếu",
  2: "Trung bình",
  3: "Mạnh",
  4: "Rất mạnh",
}

/** 4-segment password strength bar matching design system spec */
export function PasswordStrengthSegmentBar({
  strength,
}: {
  strength: StrengthLevel
}) {
  if (strength === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`flex-1 rounded-sm ${
              seg <= strength ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Độ mạnh mật khẩu: {STRENGTH_LABELS[strength]}
      </p>
    </div>
  )
}
