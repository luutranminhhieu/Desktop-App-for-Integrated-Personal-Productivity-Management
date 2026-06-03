import React from 'react';
import { TaskStats } from '@renderer/types';
import { TODO_CONFIG } from '@renderer/config/todoConfig';

interface TodoStatsProps {
  stats: TaskStats;
}

const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)]">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-6">{TODO_CONFIG.STRINGS.statsTitle}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-[var(--color-primary-lighter)] rounded-lg">
          <p className="text-xs text-[var(--color-muted)] mb-1">{TODO_CONFIG.STRINGS.statsTotal}</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
        </div>
        
        <div className="text-center p-4 bg-[#F0FDF4] rounded-lg">
          <p className="text-xs text-[#059669] mb-1">{TODO_CONFIG.STRINGS.statsCompleted}</p>
          <p className="text-2xl font-bold text-[var(--color-success)]">{stats.completed}</p>
        </div>
        
        <div className="text-center p-4 bg-[var(--color-warning-light)] rounded-lg">
          <p className="text-xs text-[var(--color-warning-text)] mb-1">{TODO_CONFIG.STRINGS.statsPending}</p>
          <p className="text-2xl font-bold text-[var(--color-warning)]">{stats.pending}</p>
        </div>
        
        <div className="text-center p-4 bg-[var(--color-error-light)] rounded-lg">
          <p className="text-xs text-[#DC2626] mb-1">{TODO_CONFIG.STRINGS.statsOverdue}</p>
          <p className="text-2xl font-bold text-[var(--color-error)]">{stats.overdue}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.completionRateLabel}</span>
            <span className="text-sm font-medium text-[var(--color-text)]">{completionRate}%</span>
          </div>
          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
            <div
              className="bg-[var(--color-success)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--color-error)]"></span>
            <span className="text-[13px] text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.statsUrgent(stats.urgent)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--color-muted)]"></span>
            <span className="text-[13px] text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.statsCanceled(stats.canceled)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></span>
            <span className="text-[13px] text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.statsThisMonth(stats.tasksThisMonth)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--color-success)]"></span>
            <span className="text-[13px] text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.statsRemaining(stats.total - stats.completed)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;