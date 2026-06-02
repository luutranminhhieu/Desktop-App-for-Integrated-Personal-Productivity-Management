import type { CalendarViewType } from '@renderer/types';

export const CALENDAR_CONFIG = {
  // Locale
  LOCALE: 'vi-VN',
  
  // Default Views configurations
  DEFAULT_VIEW: 'timeGridWeek' as CalendarViewType,
  VIEWS: [
    { key: 'timeGridDay' as const, label: 'Ngày' },
    { key: 'timeGridWeek' as const, label: 'Tuần' },
    { key: 'dayGridMonth' as const, label: 'Tháng' }
  ] as { key: CalendarViewType; label: string }[],

  // Style configurations
  FALLBACK_EVENT_COLOR: '#1E3A8A',
  
  // Date/Time Formats
  DATE_FORMATS: {
    dateTime: 'DD/MM/YYYY, HH:mm',
    timeOnly: ' HH:mm'
  },

  // Centralized strings used in UI
  STRINGS: {
    taskDetailsHeader: 'Chi tiết công việc',
    locationPrefix: 'Địa điểm: ',
    notesPrefix: 'Ghi chú: ',
    deselectButton: 'Bỏ chọn',
    selectInstruction: 'Chọn một sự kiện trên lịch để xem chi tiết.',
    todayButton: 'Today',
    unscheduledTasksHeader: 'Việc chưa xếp lịch',
    noUnscheduledTasks: 'Không có công việc chưa xếp lịch.',
    
    // API/Guard errors
    fetchError: 'Không thể tải lịch.'
  }
};
