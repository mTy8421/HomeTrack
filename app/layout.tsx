import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProvider } from "@/components/providers/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Maintenance & Asset Tracker | จัดการบ้าน รถ และทรัพย์สิน",
  description: "ระบบจัดการบ้าน รถ และทรัพย์สินภายในบ้าน บันทึกประวัติการดูแลรักษา แจ้งเตือนรอบบำรุงรักษา เอกสารสำคัญ และค่าใช้จ่ายทั้งหมดในที่เดียว",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
