"use client"

import { Check, Hexagon } from "lucide-react"

interface AuthLeftPanelProps {
  headline: string
  description: string
  features?: string[]
  /** Optional center icon element (replaces features list) */
  centerIcon?: React.ReactNode
}

export function AuthLeftPanel({
  headline,
  description,
  features,
  centerIcon,
}: AuthLeftPanelProps) {
  return (
    <div className="relative hidden w-[540px] shrink-0 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/[0.08]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 size-60 rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute right-20 top-1/2 h-40 w-24 rotate-12 rounded-2xl bg-white/[0.05]" />

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Hexagon className="size-7 fill-white/20" />
        <span className="text-[22px] font-bold tracking-tight">
          SonNguyen CX
        </span>
      </div>

      {/* Content area */}
      <div className="z-10 flex flex-1 flex-col justify-center gap-6">
        {centerIcon && (
          <div className="flex justify-center">{centerIcon}</div>
        )}
        <div className={centerIcon ? "text-center" : ""}>
          <h1
            className={`font-bold leading-tight ${
              centerIcon ? "text-[28px]" : "text-[36px]"
            }`}
          >
            {headline}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">
            {description}
          </p>
        </div>

        {features && features.length > 0 && (
          <ul className="mt-2 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span className="text-white/90">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <p className="z-10 text-xs text-white/40">
        &copy; 2025 SonNguyen CX. All rights reserved.
      </p>
    </div>
  )
}
