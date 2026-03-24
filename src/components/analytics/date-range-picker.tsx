"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "@/types/common";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  { label: "7 ngày", days: 7 },
  { label: "30 ngày", days: 30 },
  { label: "90 ngày", days: 90 },
];

export function DateRangePicker({ dateRange, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  function handlePreset(days: number) {
    onChange({ from: subDays(new Date(), days), to: new Date() });
    setOpen(false);
  }

  const label = `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className={cn("w-[280px] justify-start text-left font-normal")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {label}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 border-b p-3">
          {presets.map((p) => (
            <Button key={p.days} variant="outline" size="sm" onClick={() => handlePreset(p.days)}>
              {p.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          selected={{ from: dateRange.from, to: dateRange.to }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onChange({ from: range.from, to: range.to });
            } else if (range?.from) {
              onChange({ from: range.from, to: range.from });
            }
          }}
          numberOfMonths={2}
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  );
}
