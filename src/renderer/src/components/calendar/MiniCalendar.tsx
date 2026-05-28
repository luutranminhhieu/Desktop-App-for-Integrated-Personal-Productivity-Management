import React, { useMemo } from 'react';
import type { Dayjs } from 'dayjs';

type MiniCalendarProps = {
  monthDate: Dayjs;
  selectedDate: Dayjs;
  eventDates: Set<string>;
  onSelectDate: (value: Dayjs) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toDateKey = (value: Dayjs): string => value.format('YYYY-MM-DD');

const MiniCalendar = ({
  monthDate,
  selectedDate,
  eventDates,
  onSelectDate,
  onPrevMonth,
  onNextMonth
}: MiniCalendarProps): React.JSX.Element => {
  const days = useMemo(() => {
    const startOfMonth = monthDate.startOf('month');
    const endOfMonth = monthDate.endOf('month');
    const startWeekday = (startOfMonth.day() + 6) % 7;
    const totalDays = endOfMonth.date();
    const totalCells = Math.ceil((startWeekday + totalDays) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const dayOffset = index - startWeekday;
      const date = startOfMonth.add(dayOffset, 'day');
      const isCurrentMonth = date.month() === monthDate.month();
      return { date, isCurrentMonth };
    });
  }, [monthDate]);

  return (
    <div className="mini-calendar">
      <div className="flex items-center justify-between mb-4 px-2">
        <h4 className="text-[15px] font-bold">
          {monthDate.format('MMM')} {monthDate.format('YYYY')}
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1 rounded-full hover:bg-[var(--color-primary-lighter)] transition-colors"
          >
            <span className="material-symbols-outlined text-[var(--color-muted)] hover:text-[var(--color-primary)]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1 rounded-full hover:bg-[var(--color-primary-lighter)] transition-colors"
          >
            <span className="material-symbols-outlined text-[var(--color-muted)] hover:text-[var(--color-primary)]">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center gap-y-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-[var(--color-muted)] opacity-60"
          >
            {day}
          </div>
        ))}
        {days.map(({ date, isCurrentMonth }) => {
          const dateKey = toDateKey(date);
          const isSelected = date.isSame(selectedDate, 'day');
          const hasEvent = eventDates.has(dateKey);
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(date)}
              className={`py-1 text-sm ${
                isCurrentMonth ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)] opacity-30'
              } ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white rounded-full'
                  : 'rounded-full hover:bg-[var(--color-primary-lighter)]'
              }`}
            >
              <span className="relative inline-block">
                {date.date()}
                {hasEvent && (
                  <span
                    className={`absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[var(--color-primary)]'
                    }`}
                  ></span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
