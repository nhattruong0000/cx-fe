import Image from "next/image";
import { CircleCheck } from "lucide-react";

const features = [
  "Khảo sát CSAT, NPS, CES đa kênh",
  "Quản lý lịch hỗ trợ kỹ thuật",
  "Dashboard phân tích realtime",
];

/** Blue branding panel shown on left side of auth pages (desktop only) */
export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex w-[720px] shrink-0 flex-col justify-between bg-primary-600 p-[60px] text-white">
      {/* Top: Logo + brand */}
      <div className="space-y-3">
        <Image
          src="/logo/logo-white.webp"
          alt="Sơn Nguyên"
          width={200}
          height={57}
          priority
          unoptimized
        />
        <p className="text-sm text-primary-200">CX Platform</p>
      </div>

      {/* Middle: Heading + features */}
      <div className="space-y-6">
        <h2 className="max-w-[500px] text-[32px] font-bold leading-[1.3]">
          Nâng cao trải nghiệm{"\n"}khách hàng
        </h2>
        <p className="max-w-[480px] text-base leading-[1.6] text-primary-200">
          Quản lý khảo sát, hỗ trợ kỹ thuật và phân tích dữ liệu khách hàng —
          tất cả trong một nền tảng.
        </p>
        <div className="space-y-4">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3">
              <CircleCheck className="h-5 w-5 shrink-0 text-primary-200" />
              <span className="text-sm text-primary-100">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Footer */}
      <p className="text-xs text-primary-300">
        © 2026 Sơn Nguyên. All rights reserved.
      </p>
    </div>
  );
}
