import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface StepsProps {
  steps: { label: string; description?: string }[]
  currentStep: number
  className?: string
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <nav className={cn("flex items-center", className)} aria-label="Progress">
      <ol className="flex w-full items-center">
        {steps.map((step, index) => {
          const status =
            index < currentStep
              ? "complete"
              : index === currentStep
                ? "current"
                : "upcoming"

          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1"
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    status === "complete" &&
                      "border-primary bg-primary text-primary-foreground",
                    status === "current" &&
                      "border-primary bg-background text-primary",
                    status === "upcoming" &&
                      "border-muted-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {status === "complete" ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    status === "current"
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-[10px] text-muted-foreground">
                    {step.description}
                  </span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors",
                    index < currentStep ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
