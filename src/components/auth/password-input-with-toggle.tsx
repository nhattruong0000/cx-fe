"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PasswordInputWithToggleProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /** Additional class for wrapper div */
  wrapperClassName?: string
}

export const PasswordInputWithToggle = React.forwardRef<
  HTMLInputElement,
  PasswordInputWithToggleProps
>(({ className, wrapperClassName, ...props }, ref) => {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className={cn("relative", wrapperClassName)}>
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <Eye className="size-4" />
        ) : (
          <EyeOff className="size-4" />
        )}
      </button>
    </div>
  )
})
PasswordInputWithToggle.displayName = "PasswordInputWithToggle"
