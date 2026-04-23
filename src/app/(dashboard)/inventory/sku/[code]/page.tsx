"use client";

import { useParams } from "next/navigation";
import { SkuEvidenceFull } from "./_components/sku-evidence-full";

/** Trang chi tiết SKU — hiển thị đầy đủ evidence bundle với tabs */
export default function InventorySkuDetailPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code ?? "");

  return (
    <div className="min-h-full" data-testid="sku-evidence-detail">
      <SkuEvidenceFull code={code} />
    </div>
  );
}
