"use client";

import { useCallback, useEffect, useState } from "react";

export interface NavLink {
  /** 表示テキスト */
  label: string;
  /** リンク先 URL */
  href: string;
}

export interface NavigationBarProps {
  /** ナビゲーションリンク一覧 */
  links: NavLink[];
  /** 現在アクティブなパス（ハイライト用） */
  activePath?: string;
  className?: string;
}

export function NavigationBar({ links, activePath, className = "" }: NavigationBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // モバイルメニューが開いている間はスクロールを無効にする
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header
      className={["glass-heavy fixed inset-x-0 top-0 z-50 shadow-[var(--shadow-sm)]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── ロゴ ─────────────────────────────────── */}
        <a
          href="/"
          className="flex items-center gap-2 text-[var(--text-xl)] font-bold tracking-tight text-[var(--color-primary-700)]"
        >
          OJETP
        </a>

        {/* ── デスクトップ ナビ ────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="メインナビゲーション">
          {links.map((link) => {
            const isActive = activePath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={[
                  "rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-sm)] font-medium transition-colors duration-150",
                  isActive
                    ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                    : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* ── ハンバーガー ─────────────────────────── */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-2 text-[var(--color-neutral-600)] transition-colors duration-150 hover:bg-[var(--color-neutral-100)] md:hidden"
          aria-expanded={mobileOpen}
          aria-label="メニューを開く"
        >
          {mobileOpen ? (
            /* X アイコン */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* ハンバーガーアイコン */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── モバイルメニュー ───────────────────────── */}
      {mobileOpen && (
        <nav
          className="glass-heavy border-t border-[var(--color-neutral-200)] md:hidden"
          aria-label="モバイルナビゲーション"
        >
          <div className="space-y-1 px-4 pb-4 pt-2">
            {links.map((link) => {
              const isActive = activePath === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={[
                    "block rounded-[var(--radius-md)] px-3 py-2 text-[var(--text-base)] font-medium transition-colors duration-150",
                    isActive
                      ? "bg-[var(--color-primary-50)] text-[var(--color-primary-700)]"
                      : "text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-neutral-900)]",
                  ].join(" ")}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
