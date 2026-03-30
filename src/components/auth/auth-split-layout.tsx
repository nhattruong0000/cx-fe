import Image from "next/image";
import { AuthLeftPanel } from "./auth-left-panel";

/** Split layout for auth pages: left blue panel + right form area */
export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-[60px] lg:px-20">
        {/* Mobile-only logo */}
        <div className="mb-8 text-center lg:hidden">
          <Image
            src="/logo/logo-black.webp"
            alt="Son Nguyen"
            width={160}
            height={46}
            className="mx-auto mb-3"
            priority
            unoptimized
          />
          <p className="text-sm text-muted-foreground">CX Platform</p>
        </div>

        <div className="w-full max-w-[400px]">{children}</div>

        {/* Mobile-only footer */}
        <p className="mt-8 text-xs text-muted-foreground lg:hidden">
          &copy; 2026 Son Nguyen
        </p>
      </div>
    </div>
  );
}
