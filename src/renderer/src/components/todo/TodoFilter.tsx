import React from 'react';
import { FilterOptions, TodoStatus, TodoPriority } from './types';

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
  const statusOptions: { value: TodoStatus; label: string }[] = [
    { value: 'pending', label: 'Chờ' },
    { value: 'in_progress', label: 'Đang làm' },
    { value: 'completed', label: 'Xong' },
    { value: 'canceled', label: 'Hủy' }
  ];

  const priorityOptions: { value: TodoPriority; label: string }[] = [
    { value: 'low', label: 'Thấp' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'high', label: 'Cao' },
    { value: 'urgent', label: 'Khẩn cấp' }
  ];

  const hasActiveFilters = filters.status || filters.priority || filters.query || filters.tags?.length;

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-semibold text-[#1A1A2E]">Bộ lọc & Tìm kiếm</h2>
        
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-[#6B7280]">
            Hiển thị: {stats.filtered}/{stats.total} công việc
          </span>
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-1 text-[12px] text-[#6B7280] hover:text-[#EF4444] transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, mô tả, dự án..."
            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-2">
              Trạng thái
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value as TodoStatus || undefined })}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
            >
              <option value="">Tất cả</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-2">
              Mức độ ưu tiên
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as TodoPriority || undefined })}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
            >
              <option value="">Tất cả</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-2">
              Khoảng hạn chót
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.dueDateFrom || ''}
                onChange={(e) => onFilterChange({ ...filters, dueDateFrom: e.target.value || undefined })}
                className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
                placeholder="Từ"
              />
              <input
                type="date"
                value={filters.dueDateTo || ''}
                onChange={(e) => onFilterChange({ ...filters, dueDateTo: e.target.value || undefined })}
                className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
                placeholder="Đến"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;