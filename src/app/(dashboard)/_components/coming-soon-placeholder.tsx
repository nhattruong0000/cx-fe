import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

interface ComingSoonPlaceholderProps {
  title: string;
  description?: string;
  backHref?: string;
}

/** Placeholder cho các trang đang phát triển — hiển thị tiêu đề + thông báo + nút quay lại */
export function ComingSoonPlaceholder({
  title,
  description,
  backHref,
}: ComingSoonPlaceholderProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>
            {description ?? "Tính năng này đang được phát triển."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Đang phát triển — vui lòng quay lại sau.
          </p>
          {backHref && (
            <Link href={backHref} className={buttonVariants({ variant: "outline" })}>
              Quay lại
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
