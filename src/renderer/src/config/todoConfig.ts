import type { TodoPriority, TodoStatus } from '@renderer/types';

export const TODO_CONFIG = {
  // Locale for date formatters
  LOCALE: 'vi-VN',

  // Status Filter options used in TodoList Page
  FILTER_OPTIONS: [
    { key: 'all' as const, label: 'All', icon: 'all_inbox' },
    { key: 'todo' as const, label: 'To-do', icon: 'schedule' },
    { key: 'canceled' as const, label: 'Cancel', icon: 'cancel' },
    { key: 'completed' as const, label: 'Done', icon: 'check_circle' }
  ] as { key: 'all' | TodoStatus; label: string; icon: string }[],

  // Styles & labels for Priority Badge
  PRIORITY_BADGES: {
    high: { bg: 'var(--color-error-light)', text: '#EF4444', label: 'HIGH' },
    medium: { bg: 'var(--color-primary-light)', text: '#3B82F6', label: 'MEDIUM' },
    low: { bg: 'var(--color-surface)', text: '#6B7280', label: 'LOW' }
  } as Record<TodoPriority, { bg: string; text: string; label: string }>,

  // Color mappings for Priorities (used in components like TodoItem)
  PRIORITY_COLORS: {
    low: '#6B7280',
    medium: '#3B82F6',
    high: '#EF4444'
  } as Record<TodoPriority, string>,

  // Status Tailwind colors for badge UI
  STATUS_COLORS: {
    todo: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    completed: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    canceled: 'bg-[var(--color-muted)]/10 text-[var(--color-muted)]'
  } as Record<TodoStatus, string>,

  // Status Vietnamese Labels
  STATUS_LABELS: {
    todo: 'TO-DO',
    completed: 'DONE',
    canceled: 'CANCEL'
  } as Record<TodoStatus, string>,

  // Filter component configurations
  FILTER: {
    statusOptions: [
      { value: 'todo' as const, label: 'To-do' },
      { value: 'completed' as const, label: 'Done' },
      { value: 'canceled' as const, label: 'Cancel' }
    ] as { value: TodoStatus; label: string }[],

    priorityOptions: [
      { value: 'low' as const, label: 'Low' },
      { value: 'medium' as const, label: 'Medium' },
      { value: 'high' as const, label: 'High' }
    ] as { value: TodoPriority; label: string }[]
  },

  // Text values used across UI
  STRINGS: {
    title: 'To-do List',
    createNewTask: 'Create new tasks',
    skipped: 'Skipped',
    tasksCount: 'tasks',
    noTasksInGroup: 'No tasks in this group',
    noTasks: 'No tasks',
    tryChangingFilters: 'Try changing the filter to see other results',
    startByCreatingNew: 'Start by creating new tasks',
    edit: 'Edit',
    delete: 'Delete',
    overdueBadge: ' (OVERDUE)',
    
    // Date popover
    dateRange: 'Date Range',
    selectDateRange: 'Select Date Range',
    fromDate: 'From Date',
    toDate: 'To Date',
    clear: 'Clear',
    apply: 'Apply',
    
    // Status popover
    allStatuses: 'All Status',
    todo: 'To-do',
    cancel: 'Cancel',
    done: 'Done',
    
    // API/Guard errors
    fetchError: 'Cannot load task list.',
    userRequiredError: 'User information is missing.',
    createError: 'Cannot create task.',
    updateError: 'Cannot update task.',
    deleteError: 'Cannot delete task.',
    updateStatusError: 'Cannot update status.',

    // TodoFilter strings
    filterTitle: 'Filter & Search',
    displayLabel: (filtered: number, total: number): string => `Display: ${filtered}/${total} tasks`,
    clearFilters: 'Clear filters',
    searchPlaceholder: 'Search by title, description, project...',
    statusSelectLabel: 'Status',
    prioritySelectLabel: 'Priority',
    deadlineRangeLabel: 'Deadline Range',
    allOption: 'All',
    fromLabel: 'From',
    toLabel: 'To',

    // TodoStats strings
    statsTitle: 'Task Statistics',
    statsTotal: 'Total Tasks',
    statsCompleted: 'Completed',
    statsTodo: 'To-do',
    statsOverdue: 'Overdue',
    completionRateLabel: 'Completion Rate',
    statsCanceled: (count: number): string => `Canceled: ${count}`,
    statsThisMonth: (count: number): string => `This Month: ${count}`,
    statsRemaining: (count: number): string => `Remaining: ${count}`,
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
    titleCreate: 'Create new task',
    titleEdit: 'Edit task',
    labelTitle: 'Title',
    placeholderTitle: 'Enter title',
    labelDescription: 'Description',
    placeholderDescription: 'Enter description',
    labelPriority: 'Priority',
    labelStart: 'Start Time',
    labelEnd: 'End Time',
    
    priorities: [
      { value: 'low' as const, label: 'Low' },
      { value: 'medium' as const, label: 'Medium' },
      { value: 'high' as const, label: 'High' }
    ],
    validationTitleRequired: 'Title is required.'
  }
};
