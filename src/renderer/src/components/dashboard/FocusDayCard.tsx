import React from 'react';
import type { FocusDayCardProps } from '@renderer/types';
import { FOCUS_RING_CONFIG, DASHBOARD_STRINGS } from '@renderer/config/dashboardConfig';

const formatHours = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const fullHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${fullHours}:${minutes.toString().padStart(2, '0')}`;
};

const FocusDayCard: React.FC<FocusDayCardProps> = ({
  todayFocusHours
}) => {
  const maxHours = 24;
  const percent = Math.min(1, todayFocusHours / maxHours);
  const offset = Math.round(FOCUS_RING_CONFIG.CIRCUMFERENCE * (1 - percent) * 100) / 100;

  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] flex flex-col min-h-[300px]">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{DASHBOARD_STRINGS.focusTitle}</h2>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg
            className="focus-ring w-full h-full max-w-[130px] max-h-[130px]"
            viewBox={`0 0 ${FOCUS_RING_CONFIG.SVG_SIZE} ${FOCUS_RING_CONFIG.SVG_SIZE}`}
          >
            <circle
              cx={FOCUS_RING_CONFIG.CENTER}
              cy={FOCUS_RING_CONFIG.CENTER}
              r={FOCUS_RING_CONFIG.RADIUS}
              fill="transparent"
              stroke="var(--color-primary-light)"
              strokeWidth={FOCUS_RING_CONFIG.STROKE_WIDTH}
            ></circle>
            <circle
              cx={FOCUS_RING_CONFIG.CENTER}
              cy={FOCUS_RING_CONFIG.CENTER}
              r={FOCUS_RING_CONFIG.RADIUS}
              fill="transparent"
              stroke="var(--color-primary)"
              strokeDasharray={FOCUS_RING_CONFIG.CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
              strokeWidth={FOCUS_RING_CONFIG.STROKE_WIDTH}
            ></circle>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[var(--color-text)]">{formatHours(todayFocusHours)}</span>
            <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-1">{DASHBOARD_STRINGS.focusHoursLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusDayCard;
