import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <SearchX className="h-9 w-9 text-muted-foreground" />
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
      <p className="text-base text-muted-foreground">Trang không tồn tại</p>
      <p className="max-w-[360px] text-center text-sm text-muted-foreground">
        Trang bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-[10px] bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay về trang chủ
      </Link>
    </div>
  );
}
