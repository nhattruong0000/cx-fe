import { Card } from "@/components/ui/card";

function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-full">
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Pulse className="h-8 w-40" />
        <div className="flex gap-3">
          <Pulse className="h-8 w-8 rounded-full" />
          <Pulse className="h-8 w-24" />
        </div>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Pulse className="mb-2 h-4 w-24" />
            <Pulse className="mb-2 h-8 w-16" />
            <Pulse className="h-4 w-32" />
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <Card className="p-6">
          <Pulse className="mb-4 h-5 w-48" />
          <Pulse className="h-[180px] w-full" />
        </Card>
        <Card className="p-6">
          <Pulse className="mb-4 h-5 w-48" />
          <Pulse className="h-[180px] w-full" />
        </Card>
      </div>
    </div>
  );
}
