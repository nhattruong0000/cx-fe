import { Skeleton } from "@/components/ui/skeleton"

/** Loading skeleton for SKU evidence drawer — mirrors 5-section layout */
export function SkuEvidenceDrawerSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* 5 sections */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 border-b border-border px-5 py-4 last:border-b-0">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
      ))}
    </div>
  )
}
