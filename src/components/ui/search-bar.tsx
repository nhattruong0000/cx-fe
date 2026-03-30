"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { SearchIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value?: string
  onSearch: (value: string) => void
  placeholder?: string
  debounceMs?: number
  className?: string
}

export function SearchBar({
  value: controlledValue,
  onSearch,
  placeholder = "Tìm kiếm...",
  debounceMs = 300,
  className,
}: SearchBarProps) {
  const [inputValue, setInputValue] = React.useState(controlledValue ?? "")
  const debouncedValue = useDebounce(inputValue, debounceMs)

  React.useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setInputValue(controlledValue)
    }
  }, [controlledValue])

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-8"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          onClick={() => setInputValue("")}
          aria-label="Xóa tìm kiếm"
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}
