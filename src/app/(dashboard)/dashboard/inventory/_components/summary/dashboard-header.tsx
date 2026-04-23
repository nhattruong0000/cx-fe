// Dashboard header: title + subtitle. No branch filter per user decision.

export function DashboardHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">
        Bảng điều khiển tồn kho
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Tổng quan 5 giây: có critical không — tồn kho khỏe không — PO có drift không
      </p>
    </div>
  );
}
