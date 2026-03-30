"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OptionListEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
}

/** Editor for single/multiple choice options — each option is a separate input field */
export function OptionListEditor({ options, onChange }: OptionListEditorProps) {
  const addOption = () => {
    onChange([...options, ""]);
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    onChange(options.map((opt, i) => (i === index ? value : opt)));
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">Lựa chọn</Label>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-1">
            <Input
              placeholder={`Lựa chọn ${i + 1}`}
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => removeOption(i)}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-xs"
        onClick={addOption}
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        Thêm lựa chọn
      </Button>
    </div>
  );
}
