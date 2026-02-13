"use client";

export interface ComparisonItem {
  /** Display name of the item (row) */
  name: string;
  /** Header accent color as a CSS color string, e.g. "#3b82f6" */
  color: string;
  /** Values for each category, in the same order as the categories array */
  values: (string | number)[];
}

export interface ComparisonTableProps {
  /** Array of items to compare (rows) */
  items: ComparisonItem[];
  /** Array of category names (column headers after the first "項目" column) */
  categories: string[];
  /** Optional CSS class for the wrapper */
  className?: string;
}

export function ComparisonTable({ items, categories, className = "" }: ComparisonTableProps) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="bg-gray-50 px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              項目
            </th>
            {categories.map((cat) => (
              <th
                key={cat}
                className="bg-gray-50 px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase"
              >
                {cat}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIdx) => (
            <tr key={item.name} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  {item.name}
                </span>
              </td>
              {item.values.map((val, colIdx) => (
                <td key={categories[colIdx]} className="px-4 py-3 text-center text-gray-700">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
