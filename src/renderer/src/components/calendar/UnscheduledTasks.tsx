import React from 'react';
import type { UnscheduledTask } from '@renderer/types';

export type UnscheduledTasksProps = {
  tasks: UnscheduledTask[];
  loading: boolean;
};

const priorityStyles: Record<string, { dot: string; text: string }> = {
  urgent: { dot: 'bg-[var(--color-error)]', text: 'text-[var(--color-error)]' },
  high: { dot: 'bg-[var(--color-error)]', text: 'text-[var(--color-error)]' },
  medium: { dot: 'bg-[var(--color-primary)]', text: 'text-[var(--color-primary)]' },
  low: { dot: 'bg-[var(--color-muted)]', text: 'text-[var(--color-muted)]' }
};

const UnscheduledTasks = ({ tasks, loading }: UnscheduledTasksProps): React.JSX.Element => {
  const count = tasks.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-bold">Việc chưa xếp lịch</h4>
        <span className="text-xs font-bold text-[var(--color-muted)] bg-[var(--color-primary-lighter)] px-2 rounded">
          {loading ? '...' : count}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {loading && (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[var(--color-primary-lighter)] animate-pulse"></div>
            <div className="h-14 rounded-lg bg-[var(--color-primary-lighter)] animate-pulse"></div>
          </div>
        )}
        {!loading && count === 0 && (
          <p className="text-xs text-[var(--color-muted)]">Không có công việc chưa xếp lịch.</p>
        )}
        {!loading &&
          tasks.map((task) => {
            const style = priorityStyles[task.priority ?? 'medium'] ?? priorityStyles.medium;
            return (
              <div
                key={task._id}
                className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary-light)] transition-colors group cursor-grab"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                  <span className={`text-[11px] font-semibold uppercase ${style.text}`}>
                    {task.priority ?? 'medium'}
                  </span>
                </div>
                <p className="text-sm truncate text-[var(--color-text)]">{task.title}</p>

              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UnscheduledTasks;
