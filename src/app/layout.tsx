import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";
import { AuthHydration } from "@/providers/auth-hydration";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CX App - Quản lý trải nghiệm khách hàng",
  description: "Hệ thống quản lý trải nghiệm khách hàng cho thương mại điện tử",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={cn("font-sans", inter.variable)}>
      <body>
        <QueryProvider>
          <AuthHydration />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
