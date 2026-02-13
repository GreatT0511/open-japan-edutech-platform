"use client";

export interface PaginationProps {
  /** 現在のページ (1-indexed) */
  page: number;
  /** 総ページ数 */
  totalPages: number;
  /** ページ変更コールバック */
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * ページ番号のリストを生成する。
 * 先頭・末尾付近を省略記号で省く。
 */
function buildPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);

  return pages;
}

export function Pagination({ page, totalPages, onPageChange, className = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageNumbers(page, totalPages);

  const baseBtn =
    "inline-flex items-center justify-center min-w-[2.25rem] h-9 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium transition-colors duration-150 select-none";

  return (
    <nav
      aria-label="ページネーション"
      className={["flex items-center gap-1", className].filter(Boolean).join(" ")}
    >
      {/* 前へ */}
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={[
          baseBtn,
          "px-2",
          page <= 1
            ? "opacity-40 cursor-not-allowed text-[var(--color-neutral-400)]"
            : "cursor-pointer text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]",
        ].join(" ")}
        aria-label="前のページ"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only sm:not-sr-only sm:ml-1">前へ</span>
      </button>

      {/* ページ番号 */}
      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex items-center justify-center min-w-[2.25rem] h-9 text-[var(--text-sm)] text-[var(--color-neutral-400)] select-none"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={[
              baseBtn,
              p === page
                ? "bg-[var(--color-primary-600)] text-white shadow-sm cursor-default"
                : "cursor-pointer text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]",
            ].join(" ")}
          >
            {p}
          </button>
        ),
      )}

      {/* 次へ */}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={[
          baseBtn,
          "px-2",
          page >= totalPages
            ? "opacity-40 cursor-not-allowed text-[var(--color-neutral-400)]"
            : "cursor-pointer text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)]",
        ].join(" ")}
        aria-label="次のページ"
      >
        <span className="sr-only sm:not-sr-only sm:mr-1">次へ</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
}
