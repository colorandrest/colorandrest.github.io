import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "색채와 쉼 월간 매거진",
  description:
    "매월 새로운 주제와 작품을 더하는 성경 묵상·색채 작업 월간 매거진.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
