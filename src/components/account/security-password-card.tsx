"use client";

import Link from "next/link";
import { Key } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Displays password status with a link to the change-password section */
export function SecurityPasswordCard() {
  return (
    <Card>
      <CardHeader className="px-6 pt-4 pb-3 space-y-1.5">
        <CardTitle className="text-[17px] font-semibold tracking-[-0.3px]">
          Mật khẩu
        </CardTitle>
        <CardDescription className="text-[13px] leading-normal">
          Đã đổi 30 ngày trước. Chúng tôi khuyến nghị đổi mật khẩu thường xuyên.
        </CardDescription>
      </CardHeader>

      <CardFooter className="px-6 pt-3 pb-4 border-t border-[#E4E4E7] justify-end">
        <Link
          href="/profile#password"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Key className="h-4 w-4" />
          Đổi mật khẩu
        </Link>
      </CardFooter>
    </Card>
  );
}
