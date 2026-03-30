"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StaffCreateScheduleForm } from "./staff-create-schedule-form";

interface StaffCreateScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffCreateScheduleDialog({ open, onOpenChange }: StaffCreateScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu hỗ trợ kỹ thuật</DialogTitle>
        </DialogHeader>
        <StaffCreateScheduleForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
