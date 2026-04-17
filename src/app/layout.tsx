import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "经纪人模拟器：塌房危机",
  description: "你能撑几天不让你的艺人塌房？AI经纪人模拟器，每一个决策都可能改变命运。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen bg-[#faf8f5] text-[#1a1a2e]">
        <div className="mx-auto max-w-lg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
