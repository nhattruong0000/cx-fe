"use client"

import { HelpCircle } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * HelpTooltip — reusable help icon with tooltip popup.
 * Wraps each section title that needs explanation text.
 */
export function HelpTooltip({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          aria-label="Thông tin thêm"
          className="inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <HelpCircle className="size-3.5 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm text-xs leading-relaxed">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
