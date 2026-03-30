"use client";

import { CustomerHeader } from "@/components/layout/customer-header";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <CustomerHeader />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
