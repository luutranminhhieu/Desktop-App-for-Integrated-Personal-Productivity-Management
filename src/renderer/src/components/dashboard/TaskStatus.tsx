import React from 'react';
import type { TaskStatusProps } from '@renderer/types';

const DONUT_CIRCUMFERENCE = 2 * Math.PI * 70; // ≈ 439.82

type Segment = {
  key: string;
  label: string;
  color: string;
  value: number;
};

const TaskStatus: React.FC<TaskStatusProps> = ({ taskStats }) => {
  const overdueCount = Math.max(0, taskStats.overdue);
  const pendingCount = Math.max(0, taskStats.pending - overdueCount);
  const completedCount = Math.max(0, taskStats.completed);
  const canceledCount = Math.max(0, taskStats.canceled);
  const total = completedCount + pendingCount + overdueCount + canceledCount || 1;

  const segments: Segment[] = [
    { key: 'done', label: 'Đã xong', color: '#10B981', value: completedCount },
    { key: 'pending', label: 'Đang làm', color: '#4F3CC9', value: pendingCount },
    { key: 'overdue', label: 'Quá hạn', color: '#EF4444', value: overdueCount },
    { key: 'canceled', label: 'Hủy', color: '#E5E7EB', value: canceledCount }
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
        offset: Math.round(DONUT_CIRCUMFERENCE * (1 - percent) * 100) / 100
      };
    });

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] flex flex-col">
      <h2 className="text-[18px] font-semibold text-[#1A1A2E] mb-8">Trạng thái Task</h2>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="relative w-40 h-40 mb-6">
          <svg className="focus-ring" width="160" height="160">
            <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f0ecf8" strokeWidth="15"></circle>
            {chartSegments.map((seg) => (
              <circle
                key={seg.key}
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke={seg.color}
                strokeDasharray={DONUT_CIRCUMFERENCE}
                strokeDashoffset={seg.offset}
                strokeLinecap="round"
                strokeWidth="15"
                style={{ transform: `rotate(${seg.rotation}deg)`, transformOrigin: 'center' }}
              ></circle>
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[24px] font-semibold text-[#1A1A2E]">{taskStats.total}</span>
            <span className="text-[12px] text-[#6B7280]">Tổng số</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-3">
          {segments.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
              <span className="text-[14px] text-[#6B7280]">
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
