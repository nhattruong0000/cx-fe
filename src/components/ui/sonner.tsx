"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, CircleXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-[#16A34A]" />,
        info: <InfoIcon className="size-5 text-[#2563EB]" />,
        warning: <TriangleAlertIcon className="size-5 text-[#F59E0B]" />,
        error: <CircleXIcon className="size-5 text-[#DC2626]" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "14px",
          "--width": "380px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!rounded-[14px] !shadow-[0_4px_8px_-1px_#0000000A,0_12px_24px_-2px_#00000014] !p-4 !gap-3 !items-start",
          title: "!text-sm !font-semibold !text-[#09090B]",
          description: "!text-[13px] !font-normal !text-[#71717A]",
          closeButton: "!text-[#71717A]",
          success: "!bg-[#F0FDF4] !border-l-4 !border-l-[#16A34A] !border-t-0 !border-r-0 !border-b-0",
          error: "!bg-[#FEF2F2] !border-l-4 !border-l-[#DC2626] !border-t-0 !border-r-0 !border-b-0",
          warning: "!bg-[#FFFBEB] !border-l-4 !border-l-[#F59E0B] !border-t-0 !border-r-0 !border-b-0",
          info: "!bg-[#EFF6FF] !border-l-4 !border-l-[#2563EB] !border-t-0 !border-r-0 !border-b-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
