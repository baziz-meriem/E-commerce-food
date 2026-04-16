import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "متجر المواد الغذائية",
  description: "منصة تجارة إلكترونية للمواد الغذائية مع التوصيل والدفع عند الاستلام",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} h-full antialiased`}
    >
      <body
        className={`${cairo.className} min-h-full flex flex-col text-slate-900 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
