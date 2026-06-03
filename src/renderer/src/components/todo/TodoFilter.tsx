import React from 'react';
import { FilterOptions, TodoStatus, TodoPriority } from '@renderer/types';
import { TODO_CONFIG } from '@renderer/config/todoConfig';

interface TodoFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  stats: {
    total: number;
    filtered: number;
  };
}

const TodoFilter: React.FC<TodoFilterProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  onClearFilters,
  stats
}) => {
  const statusOptions = TODO_CONFIG.FILTER.statusOptions;
  const priorityOptions = TODO_CONFIG.FILTER.priorityOptions;

  const hasActiveFilters = filters.status || filters.priority || filters.query || filters.tags?.length;

  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{TODO_CONFIG.STRINGS.filterTitle}</h2>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-muted)]">
            {TODO_CONFIG.STRINGS.displayLabel(stats.filtered, stats.total)}
          </span>
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-error)] transition-colors"
            >
              {TODO_CONFIG.STRINGS.clearFilters}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={TODO_CONFIG.STRINGS.searchPlaceholder}
            className="w-full px-4 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[var(--color-text)] mb-2">
              {TODO_CONFIG.STRINGS.statusSelectLabel}
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value as TodoStatus || undefined })}
              className="w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              <option value="">{TODO_CONFIG.STRINGS.allOption}</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[var(--color-text)] mb-2">
              {TODO_CONFIG.STRINGS.prioritySelectLabel}
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as TodoPriority || undefined })}
              className="w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            >
              <option value="">{TODO_CONFIG.STRINGS.allOption}</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[var(--color-text)] mb-2">
              {TODO_CONFIG.STRINGS.deadlineRangeLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dueDateFrom || ''}
                onChange={(e) => onFilterChange({ ...filters, dueDateFrom: e.target.value || undefined })}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder={TODO_CONFIG.STRINGS.fromLabel}
              />
              <input
                type="date"
                value={filters.dueDateTo || ''}
                onChange={(e) => onFilterChange({ ...filters, dueDateTo: e.target.value || undefined })}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                placeholder={TODO_CONFIG.STRINGS.toLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;