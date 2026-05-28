import React from 'react';
import type { FocusDayCardProps } from '@renderer/types';

const CIRCUMFERENCE = 2 * Math.PI * 48; // ≈ 301.59

const formatHours = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const fullHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${fullHours}:${minutes.toString().padStart(2, '0')}`;
};

const FocusDayCard: React.FC<FocusDayCardProps> = ({
  todayFocusHours,
  focusGoal,
  pomodoroCompleted,
  pomodoroTarget
}) => {
  const percent = focusGoal > 0 ? Math.min(1, todayFocusHours / focusGoal) : 0;
  const offset = Math.round(CIRCUMFERENCE * (1 - percent) * 100) / 100;

  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Tập trung</h2>
        <span className="material-symbols-outlined text-[var(--color-muted)] cursor-pointer">more_vert</span>
      </div>
      <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
        <svg className="focus-ring" width="110" height="110">
          <circle cx="55" cy="55" r="48" fill="transparent" stroke="var(--color-primary-light)" strokeWidth="9"></circle>
          <circle
            cx="55"
            cy="55"
            r="48"
            fill="transparent"
            stroke="var(--color-primary)"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="9"
          ></circle>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-lg font-semibold text-[var(--color-text)]">{formatHours(todayFocusHours)}</span>
          <span className="text-[11px] text-[var(--color-muted)] uppercase">GIỜ</span>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-3 mt-1">
        <div className="text-center p-3 bg-[var(--color-surface)] rounded-lg">
          <p className="text-xs text-[var(--color-muted)] mb-1">Pomodoro</p>
          <p className="text-[15px] font-medium text-[var(--color-text)]">
            {pomodoroCompleted}/{pomodoroTarget}
          </p>
        </div>
        <div className="text-center p-3 bg-[var(--color-surface)] rounded-lg">
          <p className="text-xs text-[var(--color-muted)] mb-1">Mục tiêu</p>
          <p className="text-[15px] font-medium text-[var(--color-text)]">{focusGoal}h</p>
        </div>
      </div>
    </div>
  );
};

export default FocusDayCard;
