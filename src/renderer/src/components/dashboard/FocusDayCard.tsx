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
    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E]">Tập trung</h2>
        <span className="material-symbols-outlined text-[#6B7280] cursor-pointer">more_vert</span>
      </div>
      <div className="relative w-[110px] h-[110px] mb-4 flex items-center justify-center">
        <svg className="focus-ring" width="110" height="110">
          <circle cx="55" cy="55" r="48" fill="transparent" stroke="#EDE9FF" strokeWidth="9"></circle>
          <circle
            cx="55"
            cy="55"
            r="48"
            fill="transparent"
            stroke="#4F3CC9"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="9"
          ></circle>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-[18px] font-semibold text-[#1A1A2E]">{formatHours(todayFocusHours)}</span>
          <span className="text-[11px] text-[#6B7280] uppercase">GIỜ</span>
        </div>
      </div>
      <div className="w-full grid grid-cols-2 gap-3 mt-1">
        <div className="text-center p-3 bg-[#F5F4FA] rounded-lg">
          <p className="text-[12px] text-[#6B7280] mb-1">Pomodoro</p>
          <p className="text-[15px] font-medium text-[#1A1A2E]">
            {pomodoroCompleted}/{pomodoroTarget}
          </p>
        </div>
        <div className="text-center p-3 bg-[#F5F4FA] rounded-lg">
          <p className="text-[12px] text-[#6B7280] mb-1">Mục tiêu</p>
          <p className="text-[15px] font-medium text-[#1A1A2E]">{focusGoal}h</p>
        </div>
      </div>
    </div>
  );
};

export default FocusDayCard;
