"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSupportRequest } from "@/hooks/use-support-requests";

const requestSchema = z.object({
  issue_summary: z.string().min(1, "Tiêu đề là bắt buộc").max(200),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  preferred_date: z.string().optional(),
  phone: z.string().min(1, "Số điện thoại là bắt buộc"),
  contact_name: z.string().min(1, "Tên liên hệ là bắt buộc"),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function SupportRequestForm() {
  const router = useRouter();
  const createMut = useCreateSupportRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: RequestFormValues) => {
    try {
      await createMut.mutateAsync(data);
      toast.success("Gửi yêu cầu thành công");
      router.push("/customer/support");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gửi yêu cầu thất bại");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin yêu cầu</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue_summary">Tiêu đề vấn đề</Label>
            <Input id="issue_summary" {...register("issue_summary")} />
            {errors.issue_summary && (
              <p className="text-sm text-destructive">{errors.issue_summary.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea id="description" rows={4} {...register("description")} />
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
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi yêu cầu"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
