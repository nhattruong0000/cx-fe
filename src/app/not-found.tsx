import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
          <h1 className="text-xl font-semibold">Không tìm thấy trang</h1>
          <p className="text-sm text-muted-foreground">
            Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
          >
            Quay về trang chủ
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
