import { NavigationBar } from "@ojetp/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeacherPulse — 教員データ",
  description: "教員の労働環境・人数推移・年齢構成等を可視化します",
};

const navLinks = [
  { label: "ダッシュボード", href: "/" },
  { label: "都道府県別", href: "/prefectures" },
  { label: "勤務時間", href: "/workload" },
  { label: "採用倍率", href: "/recruitment" },
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
