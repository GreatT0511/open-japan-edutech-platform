import { NavigationBar } from "@ojetp/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduBudget -- 教育予算の可視化",
  description: "文科省予算の推移を分野別に可視化。どこにお金が使われているかを一目で把握できます",
};

const navLinks = [
  { label: "ダッシュボード", href: "/" },
  { label: "予算推移", href: "/trends" },
  { label: "主要施策", href: "/programs" },
  { label: "国際比較", href: "/oecd" },
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
