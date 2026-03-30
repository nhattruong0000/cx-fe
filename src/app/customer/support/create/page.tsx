"use client";

import { SupportRequestForm } from "@/components/customer/support-request-form";

export default function CreateSupportRequestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tạo yêu cầu hỗ trợ</h1>
        <p className="text-sm text-muted-foreground">
          Mô tả vấn đề để được hỗ trợ kỹ thuật
        </p>
      </div>
      <SupportRequestForm />
    </div>
  );
}
