import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const sizeMap = {
  sm: "size-4",
  default: "size-6",
  lg: "size-8",
} as const

type SpinnerSize = keyof typeof sizeMap

interface SpinnerProps extends React.ComponentProps<"svg"> {
  size?: SpinnerSize
}

function Spinner({ className, size = "default", ...props }: SpinnerProps) {
  return (
    <Loader2
      data-slot="spinner"
      className={cn("animate-spin text-primary", sizeMap[size], className)}
      {...props}
    />
  )
}

export { Spinner }
export type { SpinnerSize }
