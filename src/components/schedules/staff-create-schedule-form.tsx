"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useStaffCreateSupportRequest } from "@/hooks/use-support-requests";
import { useOrganizations } from "@/hooks/use-admin-orgs";

const staffRequestSchema = z.object({
  issue_summary: z.string().min(1, "Tiêu đề là bắt buộc").max(200),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  preferred_date: z.string().optional(),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  contact_name: z.string().min(1, "Tên liên hệ là bắt buộc"),
  organization_id: z.string().min(1, "Tổ chức là bắt buộc"),
});

type StaffRequestFormValues = z.infer<typeof staffRequestSchema>;

interface StaffCreateScheduleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function StaffCreateScheduleForm({ onSuccess, onCancel }: StaffCreateScheduleFormProps) {
  const createMut = useStaffCreateSupportRequest();
  const { data: orgsData } = useOrganizations({ per_page: 100 });

  const orgOptions = useMemo(
    () => orgsData?.data?.map((org) => ({ value: org.id, label: org.name })) || [],
    [orgsData]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StaffRequestFormValues>({
    resolver: zodResolver(staffRequestSchema),
  });

  const selectedOrgId = watch("organization_id");

  const onSubmit = async (data: StaffRequestFormValues) => {
    try {
      await createMut.mutateAsync(data);
      toast.success("Tạo yêu cầu hỗ trợ thành công");
      onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Tạo yêu cầu thất bại";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Organization selector with search */}
      <div className="space-y-2">
        <Label>Tổ chức</Label>
        <SearchableSelect
          options={orgOptions}
          value={selectedOrgId}
          onValueChange={(v) => setValue("organization_id", v)}
          placeholder="Chọn tổ chức"
          searchPlaceholder="Tìm tổ chức..."
          emptyMessage="Không tìm thấy tổ chức."
        />
        {errors.organization_id && (
          <p className="text-sm text-destructive">{errors.organization_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue_summary">Tiêu đề vấn đề</Label>
        <Input id="issue_summary" {...register("issue_summary")} />
        {errors.issue_summary && (
          <p className="text-sm text-destructive">{errors.issue_summary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả chi tiết</Label>
        <Textarea id="description" rows={3} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" type="tel" {...register("phone")} />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_name">Tên liên hệ</Label>
          <Input id="contact_name" {...register("contact_name")} />
          {errors.contact_name && (
            <p className="text-sm text-destructive">{errors.contact_name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferred_date">Ngày mong muốn</Label>
        <Input id="preferred_date" type="date" {...register("preferred_date")} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            "Tạo yêu cầu"
          )}
        </Button>
      </div>
    </form>
  );
}
