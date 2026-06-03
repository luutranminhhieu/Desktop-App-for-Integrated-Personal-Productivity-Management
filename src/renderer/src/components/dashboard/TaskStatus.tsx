import React from 'react';
import type { TaskStatusProps } from '@renderer/types';
import { TASK_DONUT_CONFIG, DASHBOARD_STRINGS } from '@renderer/config/dashboardConfig';

type Segment = {
  key: string;
  label: string;
  color: string;
  value: number;
};

const TaskStatus: React.FC<TaskStatusProps> = ({ taskStats }) => {
  const overdueCount = Math.max(0, taskStats.overdue);
  const todoCount = Math.max(0, taskStats.todo - overdueCount);
  const completedCount = Math.max(0, taskStats.completed);
  const total = completedCount + todoCount + overdueCount || 1;

  const segments: Segment[] = [
    { key: 'done', label: DASHBOARD_STRINGS.taskDone, color: 'var(--color-success)', value: completedCount },
    { key: 'todo', label: DASHBOARD_STRINGS.taskPending, color: 'var(--color-primary)', value: todoCount },
    { key: 'overdue', label: DASHBOARD_STRINGS.taskOverdue, color: 'var(--color-error)', value: overdueCount }
  ];

  const pct = (v: number): number => Math.round((v / total) * 100);

  let rotation = 0;
  const chartSegments = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const percent = s.value / total;
      const r = rotation;
      rotation += percent * 360;
      return {
        ...s,
        rotation: r,
        offset: Math.round(TASK_DONUT_CONFIG.CIRCUMFERENCE * (1 - percent) * 100) / 100
      };
    });

  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] flex flex-col h-full justify-between">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6">{DASHBOARD_STRINGS.taskStatusTitle}</h2>
      <div className="flex-1 flex flex-row items-center justify-center gap-16 py-2">
        <div className="relative w-40 h-40 shrink-0">
          <svg
            className="focus-ring w-full h-full max-w-[160px] max-h-[160px]"
            viewBox={`0 0 ${TASK_DONUT_CONFIG.SVG_SIZE} ${TASK_DONUT_CONFIG.SVG_SIZE}`}
          >
            <circle
              cx={TASK_DONUT_CONFIG.CENTER}
              cy={TASK_DONUT_CONFIG.CENTER}
              r={TASK_DONUT_CONFIG.RADIUS}
              fill="transparent"
              stroke="var(--color-primary-light)"
              strokeWidth={TASK_DONUT_CONFIG.STROKE_WIDTH}
            ></circle>
            {chartSegments.map((seg) => (
              <circle
                key={seg.key}
                cx={TASK_DONUT_CONFIG.CENTER}
                cy={TASK_DONUT_CONFIG.CENTER}
                r={TASK_DONUT_CONFIG.RADIUS}
                fill="transparent"
                stroke={seg.color}
                strokeDasharray={TASK_DONUT_CONFIG.CIRCUMFERENCE}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
                strokeWidth={TASK_DONUT_CONFIG.STROKE_WIDTH}
                style={{ transform: `rotate(${seg.rotation}deg)`, transformOrigin: 'center' }}
              ></circle>
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--color-text)]">{taskStats.total}</span>
            <span className="text-xs text-[var(--color-muted)] font-medium uppercase tracking-wider">{DASHBOARD_STRINGS.taskTotalLabel}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 min-w-[150px]">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[var(--color-text)]">{s.label}</span>
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  {s.value} tasks ({pct(s.value)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatus;
