import { NavigationBar } from "@ojetp/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CurriculumMap -- 学習指導要領の比較",
  description: "教科・学年ごとの学習内容を構造化し、改訂による変更点を可視化します",
};

const navLinks = [
  { label: "ダッシュボード", href: "/" },
  { label: "教科一覧", href: "/subjects" },
  { label: "指導要領", href: "/guidelines" },
  { label: "新旧比較", href: "/compare" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)]">
        <NavigationBar links={navLinks} />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
