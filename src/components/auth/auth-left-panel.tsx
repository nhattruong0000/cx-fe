import Image from "next/image";

/** Blue branding panel shown on the left side of auth pages (hidden on mobile) */
export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-primary p-12 text-white">
      <div className="max-w-sm text-center space-y-6">
        <Image
          src="/logo/logo-white.webp"
          alt="Son Nguyen"
          width={200}
          height={58}
          className="mx-auto"
          priority
          unoptimized
        />
        <h2 className="text-2xl font-bold">CX Platform</h2>
        <p className="text-primary-foreground/80 text-sm leading-relaxed">
          Nền tảng quản lý trải nghiệm khách hàng toàn diện cho doanh nghiệp
        </p>
      </div>
    </div>
  );
}
