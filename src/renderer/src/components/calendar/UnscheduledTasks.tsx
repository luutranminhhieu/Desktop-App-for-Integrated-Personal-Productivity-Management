import React from 'react';
import type { UnscheduledTask } from './types';

export type UnscheduledTasksProps = {
  tasks: UnscheduledTask[];
  loading: boolean;
};

const priorityStyles: Record<string, { dot: string; text: string }> = {
  urgent: { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]' },
  high: { dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]' },
  medium: { dot: 'bg-[#4F3CC9]', text: 'text-[#4F3CC9]' },
  low: { dot: 'bg-[#10B981]', text: 'text-[#10B981]' }
};

const UnscheduledTasks = ({ tasks, loading }: UnscheduledTasksProps): React.JSX.Element => {
  const count = tasks.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[15px] font-bold">Việc chưa xếp lịch</h4>
        <span className="text-[12px] font-bold text-[#6B7280] bg-[#F6F2FE] px-2 rounded">
          {loading ? '...' : count}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {loading && (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F6F2FE] animate-pulse"></div>
            <div className="h-14 rounded-lg bg-[#F6F2FE] animate-pulse"></div>
          </div>
        )}
        {!loading && count === 0 && (
          <p className="text-[12px] text-[#6B7280]">Không có công việc chưa xếp lịch.</p>
        )}
        {!loading &&
          tasks.map((task) => {
            const style = priorityStyles[task.priority ?? 'medium'] ?? priorityStyles.medium;
            return (
              <div
                key={task._id}
                className="p-3 bg-white border border-[#E5E7EB] rounded-lg hover:border-[#EDE9FF] transition-colors group cursor-grab"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                  <span className={`text-[11px] font-semibold uppercase ${style.text}`}>
                    {task.priority ?? 'medium'}
                  </span>
                </div>
                <p className="text-[14px] truncate">{task.title}</p>
                {task.project && <p className="text-[12px] text-[#6B7280] truncate">{task.project}</p>}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default UnscheduledTasks;
