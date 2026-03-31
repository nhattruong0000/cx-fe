"use client"

import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

// Standard radio group container
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

// Standard radio button item
// v2: border #E4E4E7, checked border-[#2556C5] + filled dot
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-[#E4E4E7] outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-[#2556C5] focus-visible:ring-2 focus-visible:ring-[#2556C5]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-checked:border-[#2556C5] data-checked:bg-[#2556C5]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

// RadioCard variant — card-style radio for role/option selectors (invite page)
// v2: selected border-[#2556C5] bg-[#F0F4FF]; unselected border-[#E4E4E7] bg-white
interface RadioCardProps extends RadioPrimitive.Root.Props {
  title: string
  description?: string
}

function RadioCard({ className, title, description, ...props }: RadioCardProps) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-card"
      className={cn(
        "group/radio-card relative flex w-full cursor-pointer items-start gap-3 rounded-[10px] border p-4 text-left transition-colors outline-none",
        "border-[#E4E4E7] bg-white hover:bg-[#F8FAFC]",
        "data-checked:border-[#2556C5] data-checked:bg-[#F0F4FF]",
        "focus-visible:ring-2 focus-visible:ring-[#2556C5]/20 focus-visible:border-[#2556C5]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* Custom radio indicator circle */}
      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-[#E4E4E7] transition-colors group-data-checked/radio-card:border-[#2556C5] group-data-checked/radio-card:bg-[#2556C5]">
        <RadioPrimitive.Indicator>
          <span className="block size-1.5 rounded-full bg-white" />
        </RadioPrimitive.Indicator>
      </span>

      {/* Label content */}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[#09090B]">{title}</span>
        {description && (
          <span className="text-xs text-[#71717A]">{description}</span>
        )}
      </div>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem, RadioCard }
