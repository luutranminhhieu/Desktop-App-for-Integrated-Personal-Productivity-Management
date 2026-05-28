import React, { useMemo } from 'react';
import type { HeatmapProps } from '@renderer/types';

const CELL = 14;
const GAP = 3;
const ROWS = 7;
const COLS = 52;

const DAY_LABELS = ['', 'T2', '', 'T4', '', 'T6', ''];

const intensityColor = (value: number, max: number): string => {
  if (value === 0) return '#EBEDF0';
  const ratio = max > 0 ? value / max : 0;
  if (ratio <= 0.25) return '#C6E48B';
  if (ratio <= 0.5) return '#7BC96F';
  if (ratio <= 0.75) return '#239A3B';
  return '#196127';
};

const Heatmap: React.FC<HeatmapProps> = ({ startDate, values }) => {
  const { cells, monthLabels, maxVal } = useMemo(() => {
    const start = new Date(startDate);
    const maxVal = Math.max(...values, 1);

    /* Build 7×52 cell grid */
    const cells: { col: number; row: number; value: number; dateStr: string }[] = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const col = Math.floor(i / ROWS);
      const row = i % ROWS;
      cells.push({
        col,
        row,
        value: values[i] ?? 0,
        dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    }

    /* Month labels positioned at the column where each month first appears */
    const seen = new Set<number>();
    const monthLabels: { label: string; col: number }[] = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const month = d.getMonth();
      const col = Math.floor(i / ROWS);
      if (!seen.has(month)) {
        seen.add(month);
        monthLabels.push({
          label: d.toLocaleDateString('vi-VN', { month: 'short' }),
          col
        });
      }
    }

    return { cells, monthLabels, maxVal };
  }, [startDate, values]);

  const svgWidth = COLS * (CELL + GAP) + 30; // 30 = left padding for day labels
  const svgHeight = ROWS * (CELL + GAP) + 24; // 24 = top padding for month labels

  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)]">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Hoạt động trong năm</h2>
      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Month labels */}
          {monthLabels.map((m) => (
            <text
              key={m.label + m.col}
              x={30 + m.col * (CELL + GAP)}
              y={12}
              fontSize="10"
              fill="var(--color-muted)"
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={`day-${i}`}
                x={0}
                y={24 + i * (CELL + GAP) + CELL - 2}
                fontSize="10"
                fill="var(--color-muted)"
              >
                {label}
              </text>
            ) : null
          )}

          {/* Cells */}
          {cells.map((c) => (
            <rect
              key={`${c.col}-${c.row}`}
              x={30 + c.col * (CELL + GAP)}
              y={24 + c.row * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx={3}
              fill={intensityColor(c.value, maxVal)}
            >
              <title>
                {c.dateStr}: {c.value} hoạt động
              </title>
            </rect>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-3 text-[11px] text-[var(--color-muted)]">
        <span>Ít</span>
        {['#EBEDF0', '#C6E48B', '#7BC96F', '#239A3B', '#196127'].map((color) => (
          <span
            key={color}
            className="inline-block rounded-sm"
            style={{ width: CELL, height: CELL, backgroundColor: color }}
          ></span>
        ))}
        <span>Nhiều</span>
      </div>
    </div>
  );
};

export default Heatmap;
