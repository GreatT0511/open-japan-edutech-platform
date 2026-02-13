import { NavigationBar } from "@ojetp/ui";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniScope — 大学データ",
  description: "大学の基本情報・入学定員・就職率等を比較できます",
};

const navLinks = [
  { label: "ダッシュボード", href: "/" },
  { label: "大学一覧", href: "/universities" },
  { label: "学費比較", href: "/tuition" },
  { label: "就職データ", href: "/employment" },
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
