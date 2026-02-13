"use client";

import { motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface JapanMapProps {
  /** Map from prefecture code (1-47) to a numeric value */
  data?: Map<number, number>;
  /** Called when a prefecture is clicked */
  onPrefectureClick?: (prefCode: number, prefName: string) => void;
  /** Color scale: [minColor, maxColor] as hex strings. Default ["#d1fae5", "#065f46"] (green) */
  colorScale?: [string, string];
  /** Width of the SVG viewBox. Default 560 */
  width?: number;
  /** Height of the SVG viewBox. Default 760 */
  height?: number;
  className?: string;
}

interface PrefectureInfo {
  code: number;
  name: string;
  /** Simplified rectangular x, y, width, height in viewBox coordinates */
  x: number;
  y: number;
  w: number;
  h: number;
}

/* ------------------------------------------------------------------ */
/*  Prefecture data: simplified rectangular grid by region             */
/*  Laid out roughly geographically: Hokkaido top, Okinawa bottom      */
/* ------------------------------------------------------------------ */

const PREFECTURES: PrefectureInfo[] = [
  // -- Hokkaido (top) --
  { code: 1, name: "北海道", x: 370, y: 10, w: 120, h: 90 },

  // -- Tohoku --
  { code: 2, name: "青森県", x: 380, y: 120, w: 55, h: 40 },
  { code: 3, name: "岩手県", x: 440, y: 120, w: 55, h: 40 },
  { code: 4, name: "宮城県", x: 440, y: 165, w: 55, h: 40 },
  { code: 5, name: "秋田県", x: 380, y: 165, w: 55, h: 40 },
  { code: 6, name: "山形県", x: 380, y: 210, w: 55, h: 40 },
  { code: 7, name: "福島県", x: 440, y: 210, w: 55, h: 40 },

  // -- Kanto --
  { code: 8, name: "茨城県", x: 420, y: 265, w: 45, h: 38 },
  { code: 9, name: "栃木県", x: 420, y: 308, w: 45, h: 38 },
  { code: 10, name: "群馬県", x: 370, y: 265, w: 45, h: 38 },
  { code: 11, name: "埼玉県", x: 370, y: 308, w: 45, h: 38 },
  { code: 12, name: "千葉県", x: 470, y: 308, w: 45, h: 38 },
  { code: 13, name: "東京都", x: 420, y: 351, w: 45, h: 38 },
  { code: 14, name: "神奈川県", x: 370, y: 351, w: 45, h: 38 },

  // -- Chubu --
  { code: 15, name: "新潟県", x: 330, y: 165, w: 45, h: 55 },
  { code: 16, name: "富山県", x: 275, y: 225, w: 45, h: 38 },
  { code: 17, name: "石川県", x: 225, y: 225, w: 45, h: 38 },
  { code: 18, name: "福井県", x: 225, y: 268, w: 45, h: 38 },
  { code: 19, name: "山梨県", x: 370, y: 394, w: 45, h: 38 },
  { code: 20, name: "長野県", x: 325, y: 265, w: 40, h: 75 },
  { code: 21, name: "岐阜県", x: 275, y: 268, w: 45, h: 38 },
  { code: 22, name: "静岡県", x: 325, y: 394, w: 42, h: 38 },
  { code: 23, name: "愛知県", x: 275, y: 350, w: 45, h: 38 },

  // -- Kinki (Kansai) --
  { code: 24, name: "三重県", x: 275, y: 394, w: 45, h: 38 },
  { code: 25, name: "滋賀県", x: 225, y: 310, w: 45, h: 38 },
  { code: 26, name: "京都府", x: 175, y: 268, w: 45, h: 38 },
  { code: 27, name: "大阪府", x: 225, y: 394, w: 45, h: 38 },
  { code: 28, name: "兵庫県", x: 175, y: 350, w: 45, h: 38 },
  { code: 29, name: "奈良県", x: 225, y: 350, w: 45, h: 38 },
  { code: 30, name: "和歌山県", x: 175, y: 394, w: 45, h: 38 },

  // -- Chugoku --
  { code: 31, name: "鳥取県", x: 130, y: 268, w: 42, h: 38 },
  { code: 32, name: "島根県", x: 80, y: 268, w: 45, h: 38 },
  { code: 33, name: "岡山県", x: 130, y: 310, w: 42, h: 38 },
  { code: 34, name: "広島県", x: 80, y: 310, w: 45, h: 38 },
  { code: 35, name: "山口県", x: 30, y: 310, w: 45, h: 38 },

  // -- Shikoku --
  { code: 36, name: "徳島県", x: 175, y: 437, w: 45, h: 38 },
  { code: 37, name: "香川県", x: 130, y: 395, w: 42, h: 38 },
  { code: 38, name: "愛媛県", x: 80, y: 395, w: 45, h: 38 },
  { code: 39, name: "高知県", x: 130, y: 437, w: 42, h: 38 },

  // -- Kyushu --
  { code: 40, name: "福岡県", x: 30, y: 395, w: 45, h: 38 },
  { code: 41, name: "佐賀県", x: 30, y: 437, w: 42, h: 30 },
  { code: 42, name: "長崎県", x: 10, y: 437, w: 18, h: 55 },
  { code: 43, name: "熊本県", x: 30, y: 470, w: 42, h: 38 },
  { code: 44, name: "大分県", x: 75, y: 437, w: 42, h: 34 },
  { code: 45, name: "宮崎県", x: 75, y: 475, w: 42, h: 38 },
  { code: 46, name: "鹿児島県", x: 30, y: 512, w: 45, h: 42 },

  // -- Okinawa (bottom-left) --
  { code: 47, name: "沖縄県", x: 10, y: 620, w: 55, h: 38 },
];

/* ------------------------------------------------------------------ */
/*  Color interpolation helpers                                        */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.substring(0, 2), 16),
    Number.parseInt(h.substring(2, 4), 16),
    Number.parseInt(h.substring(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function interpolateColor(minColor: string, maxColor: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(minColor);
  const [r2, g2, b2] = hexToRgb(maxColor);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_COLOR_SCALE: [string, string] = ["#d1fae5", "#065f46"];
const NO_DATA_COLOR = "#e5e7eb";

export function JapanMap({
  data,
  onPrefectureClick,
  colorScale = DEFAULT_COLOR_SCALE,
  width = 560,
  height = 760,
  className = "",
}: JapanMapProps) {
  const [hoveredPref, setHoveredPref] = useState<number | null>(null);

  const { minVal, maxVal } = useMemo(() => {
    if (!data || data.size === 0) return { minVal: 0, maxVal: 1 };
    const values = Array.from(data.values());
    return {
      minVal: Math.min(...values),
      maxVal: Math.max(...values),
    };
  }, [data]);

  const getFillColor = useCallback(
    (code: number): string => {
      if (!data || !data.has(code)) return NO_DATA_COLOR;
      const value = data.get(code)!;
      const range = maxVal - minVal;
      const t = range === 0 ? 0.5 : (value - minVal) / range;
      return interpolateColor(colorScale[0], colorScale[1], t);
    },
    [data, minVal, maxVal, colorScale],
  );

  const legendStops = 5;

  return (
    <div className={`inline-block ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        role="img"
        aria-label="日本地図"
      >
        <title>日本地図 - 47都道府県</title>

        {PREFECTURES.map((pref) => {
          const isHovered = hoveredPref === pref.code;
          const fillColor = getFillColor(pref.code);
          const value = data?.get(pref.code);

          return (
            <motion.g
              key={pref.code}
              onMouseEnter={() => setHoveredPref(pref.code)}
              onMouseLeave={() => setHoveredPref(null)}
              onClick={() => onPrefectureClick?.(pref.code, pref.name)}
              style={{ cursor: onPrefectureClick ? "pointer" : "default" }}
              whileHover={{ scale: 1.05 }}
              role="button"
              tabIndex={0}
              aria-label={`${pref.name}${value !== undefined ? `: ${value}` : ""}`}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPrefectureClick?.(pref.code, pref.name);
                }
              }}
            >
              <rect
                x={pref.x}
                y={pref.y}
                width={pref.w}
                height={pref.h}
                rx={4}
                ry={4}
                fill={fillColor}
                stroke={isHovered ? "#1e40af" : "#94a3b8"}
                strokeWidth={isHovered ? 2 : 1}
              />
              <text
                x={pref.x + pref.w / 2}
                y={pref.y + pref.h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={pref.w < 30 ? 7 : 9}
                fill="#1f2937"
                pointerEvents="none"
              >
                {pref.name.replace(/県|府|都/, "")}
              </text>
            </motion.g>
          );
        })}

        {/* ---- Tooltip ---- */}
        {hoveredPref !== null &&
          (() => {
            const pref = PREFECTURES.find((p) => p.code === hoveredPref);
            if (!pref) return null;
            const value = data?.get(pref.code);
            const tx = Math.min(pref.x + pref.w / 2, width - 80);
            const ty = pref.y - 10;
            return (
              <g pointerEvents="none">
                <rect
                  x={tx - 50}
                  y={ty - 28}
                  width={100}
                  height={26}
                  rx={4}
                  fill="#1f2937"
                  opacity={0.9}
                />
                <text
                  x={tx}
                  y={ty - 15}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={10}
                  fill="white"
                >
                  {pref.name}
                  {value !== undefined ? ` : ${value}` : ""}
                </text>
              </g>
            );
          })()}

        {/* ---- Legend ---- */}
        <g transform={`translate(${width - 150}, ${height - 60})`}>
          <text x={0} y={-8} fontSize={10} fill="#6b7280">
            {data && data.size > 0 ? "凡例" : "データなし"}
          </text>
          {data && data.size > 0 && (
            <>
              {Array.from({ length: legendStops }).map((_, i) => {
                const t = i / (legendStops - 1);
                const color = interpolateColor(colorScale[0], colorScale[1], t);
                return <rect key={i} x={i * 24} y={0} width={24} height={12} fill={color} />;
              })}
              <text x={0} y={24} fontSize={9} fill="#6b7280">
                {minVal}
              </text>
              <text x={legendStops * 24} y={24} textAnchor="end" fontSize={9} fill="#6b7280">
                {maxVal}
              </text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
