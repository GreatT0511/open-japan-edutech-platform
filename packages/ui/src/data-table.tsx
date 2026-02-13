"use client";

import type { ReactNode } from "react";
import { Skeleton } from "./skeleton";

export interface DataTableColumn<T> {
  /** テーブルヘッダーに表示するテキスト */
  header: string;
  /** データオブジェクトのキー */
  accessor: keyof T & string;
  /** カスタムレンダー関数（省略時は文字列として表示） */
  render?: (value: T[keyof T], row: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  /** ローディング状態 */
  loading?: boolean;
  /** ローディング時に表示するスケルトン行数 */
  skeletonRows?: number;
  /** データが空のときのメッセージ */
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  emptyMessage = "データがありません",
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={[
        "overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-neutral-200)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table className="w-full border-collapse text-left text-[var(--text-sm)]">
        <thead>
          <tr className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className="px-4 py-3 font-semibold text-[var(--color-neutral-700)] whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-neutral-100)]">
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIdx) => (
              <tr key={`skeleton-${rowIdx}`}>
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-3">
                    <Skeleton width="75%" height="1rem" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-[var(--color-neutral-400)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="transition-colors duration-100 hover:bg-[var(--color-neutral-50)]"
              >
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-3 text-[var(--color-neutral-800)]">
                    {col.render
                      ? col.render(row[col.accessor], row, rowIdx)
                      : String(row[col.accessor] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
