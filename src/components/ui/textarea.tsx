import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // v2: rounded-[10px], border #E4E4E7, placeholder #94A3B8, focus ring #2556C5, min-h-[100px]
        "flex w-full min-h-[100px] rounded-[10px] border border-[#E4E4E7] bg-transparent px-3 py-2 text-sm text-[#09090B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors outline-none placeholder:text-[#94A3B8] focus-visible:border-[#2556C5] focus-visible:ring-2 focus-visible:ring-[#2556C5]/20 disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
