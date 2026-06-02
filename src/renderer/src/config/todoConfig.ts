import type { TodoPriority, TodoStatus } from '@renderer/types';

export const TODO_CONFIG = {
  // Locale for date formatters
  LOCALE: 'vi-VN',

  // Status Filter options used in TodoList Page
  FILTER_OPTIONS: [
    { key: 'all' as const, label: 'Tất cả', icon: 'all_inbox' },
    { key: 'pending' as const, label: 'To-do', icon: 'schedule' },
    { key: 'canceled' as const, label: 'Cancel', icon: 'cancel' },
    { key: 'completed' as const, label: 'Done', icon: 'check_circle' }
  ] as { key: 'all' | TodoStatus; label: string; icon: string }[],

  // Styles & labels for Priority Badge
  PRIORITY_BADGES: {
    urgent: { bg: 'var(--color-error-light)', text: '#DC2626', label: 'URGENT' },
    high: { bg: 'var(--color-error-light)', text: '#EF4444', label: 'HIGH' },
    medium: { bg: 'var(--color-primary-light)', text: '#3B82F6', label: 'MEDIUM' },
    low: { bg: 'var(--color-surface)', text: '#6B7280', label: 'LOW' }
  } as Record<TodoPriority, { bg: string; text: string; label: string }>,

  // Color mappings for Priorities (used in components like TodoItem)
  PRIORITY_COLORS: {
    low: '#6B7280',
    medium: '#3B82F6',
    high: '#EF4444',
    urgent: '#DC2626'
  } as Record<TodoPriority, string>,

  // Status Tailwind colors for badge UI
  STATUS_COLORS: {
    pending: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    completed: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    canceled: 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
  } as Record<TodoStatus, string>,

  // Status Vietnamese Labels
  STATUS_LABELS: {
    pending: 'CHỜ',
    completed: 'XONG',
    canceled: 'HỦY'
  } as Record<TodoStatus, string>,

  // Filter component configurations
  FILTER: {
    statusOptions: [
      { value: 'pending' as const, label: 'Chờ' },
      { value: 'completed' as const, label: 'Xong' },
      { value: 'canceled' as const, label: 'Hủy' }
    ] as { value: TodoStatus; label: string }[],

    priorityOptions: [
      { value: 'low' as const, label: 'Thấp' },
      { value: 'medium' as const, label: 'Trung bình' },
      { value: 'high' as const, label: 'Cao' },
      { value: 'urgent' as const, label: 'Khẩn cấp' }
    ] as { value: TodoPriority; label: string }[]
  },

  // Text values used across UI
  STRINGS: {
    title: 'Danh sách công việc',
    createNewTask: 'Tạo task mới',
    skipped: 'Skipped',
    tasksCount: 'tasks',
    noTasksInGroup: 'Không có task nào trong nhóm này',
    noTasks: 'Không có task nào',
    tryChangingFilters: 'Thử thay đổi bộ lọc để thấy kết quả khác',
    startByCreatingNew: 'Bắt đầu bằng việc tạo task mới',
    edit: 'Chỉnh sửa',
    delete: 'Xóa',
    overdueBadge: ' (QUÁ HẠN)',
    
    // Date popover
    dateRange: 'Khoảng ngày',
    selectDateRange: 'Chọn khoảng ngày',
    fromDate: 'Từ ngày',
    toDate: 'Đến ngày',
    clear: 'Xóa',
    apply: 'Áp dụng',
    
    // Status popover
    allStatuses: 'Tất cả trạng thái',
    todo: 'To-do',
    cancel: 'Cancel',
    done: 'Done',

    // Confirmation & Messages
    deleteConfirm: 'Bạn có chắc chắn muốn xóa task này?',
    
    // API/Guard errors
    fetchError: 'Không thể tải danh sách task.',
    userRequiredError: 'Thiếu thông tin người dùng.',
    createError: 'Không thể tạo task.',
    updateError: 'Không thể cập nhật task.',
    deleteError: 'Không thể xóa task.',
    updateStatusError: 'Không thể cập nhật trạng thái.',

    // TodoFilter strings
    filterTitle: 'Bộ lọc & Tìm kiếm',
    displayLabel: (filtered: number, total: number): string => `Hiển thị: ${filtered}/${total} công việc`,
    clearFilters: 'Xóa bộ lọc',
    searchPlaceholder: 'Tìm kiếm theo tiêu đề, mô tả, dự án...',
    statusSelectLabel: 'Trạng thái',
    prioritySelectLabel: 'Mức độ ưu tiên',
    deadlineRangeLabel: 'Khoảng hạn chót',
    allOption: 'Tất cả',
    fromLabel: 'Từ',
    toLabel: 'Đến',

    // TodoStats strings
    statsTitle: 'Thống kê công việc',
    statsTotal: 'Tổng công việc',
    statsCompleted: 'Hoàn thành',
    statsPending: 'Đang làm',
    statsOverdue: 'Quá hạn',
    completionRateLabel: 'Tỷ lệ hoàn thành',
    statsUrgent: (count: number): string => `Khẩn cấp: ${count}`,
    statsCanceled: (count: number): string => `Hủy: ${count}`,
    statsThisMonth: (count: number): string => `Tháng này: ${count}`,
    statsRemaining: (count: number): string => `Còn lại: ${count}`,
  },

  // Dynamic formatting strings
  FORMATS: {
    expiredLessAnHourAgo: 'Expired < 1h ago',
    expiredHoursAgo: (hours: number): string => `Expired ${hours}h ago`,
    expiredDaysAgo: (days: number): string => `Expired ${days}d ago`,
    doneAt: (timeStr: string): string => `Done at ${timeStr}`
  },

  // Todo Modal Form Configuration
  TODO_MODAL: {
    titleCreate: 'Tạo task mới',
    titleEdit: 'Chỉnh sửa task',
    labelTitle: 'Tiêu đề',
    placeholderTitle: 'Nhập tiêu đề công việc',
    labelDescription: 'Mô tả',
    placeholderDescription: 'Mô tả chi tiết (tùy chọn)',
    labelPriority: 'Mức độ ưu tiên',
    labelStart: 'Thời điểm bắt đầu',
    labelEnd: 'Thời điểm kết thúc',
    
    priorities: [
      { value: 'low' as const, label: 'Low' },
      { value: 'medium' as const, label: 'Medium' },
      { value: 'high' as const, label: 'High' }
    ],
    validationTitleRequired: 'Vui lòng nhập tiêu đề.'
  }
};
