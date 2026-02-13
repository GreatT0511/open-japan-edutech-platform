import { NavigationBar } from "@ojetp/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyCompass -- 政党別教育政策スタンス",
  description: "各政党の教育政策を分野別に比較。選挙前の判断材料として活用できます",
};

const navLinks = [
  { label: "ダッシュボード", href: "/" },
  { label: "政党一覧", href: "/parties" },
  { label: "分野別比較", href: "/categories" },
  { label: "政党間比較", href: "/compare" },
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
