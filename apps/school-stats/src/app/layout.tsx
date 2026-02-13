import { NavigationBar } from "@ojetp/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SchoolStats -- 学校基本統計",
  description: "都道府県別の学校数・児童生徒数・クラスサイズを地図とグラフで表示します",
};

const navLinks = [
  { label: "ダッシュボード", href: "/" },
  { label: "都道府県別", href: "/prefectures" },
  { label: "児童生徒数", href: "/enrollment" },
  { label: "課題データ", href: "/issues" },
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
