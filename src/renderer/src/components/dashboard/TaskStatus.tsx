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
  const canceledCount = Math.max(0, taskStats.canceled);
  const total = completedCount + todoCount + overdueCount + canceledCount || 1;

  const segments: Segment[] = [
    { key: 'done', label: DASHBOARD_STRINGS.taskDone, color: 'var(--color-success)', value: completedCount },
    { key: 'todo', label: DASHBOARD_STRINGS.taskPending, color: 'var(--color-primary)', value: todoCount },
    { key: 'overdue', label: DASHBOARD_STRINGS.taskOverdue, color: 'var(--color-error)', value: overdueCount },
    { key: 'canceled', label: DASHBOARD_STRINGS.taskCanceled, color: 'var(--color-muted)', value: canceledCount }
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
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] flex flex-col">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-8">{DASHBOARD_STRINGS.taskStatusTitle}</h2>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="relative w-40 h-40 mb-6">
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
            <span className="text-2xl font-semibold text-[var(--color-text)]">{taskStats.total}</span>
            <span className="text-xs text-[var(--color-muted)]">{DASHBOARD_STRINGS.taskTotalLabel}</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span className="text-sm text-[var(--color-muted)]">
                {s.label} ({pct(s.value)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStatus;
