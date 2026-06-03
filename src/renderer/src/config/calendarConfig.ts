import type { CalendarViewType } from '@renderer/types';

export const CALENDAR_CONFIG = {
  // Locale
  LOCALE: 'en-US',
  
  // Default Views configurations
  DEFAULT_VIEW: 'timeGridWeek' as CalendarViewType,
  VIEWS: [
    { key: 'timeGridDay' as const, label: 'Day' },
    { key: 'timeGridWeek' as const, label: 'Week' },
    { key: 'dayGridMonth' as const, label: 'Month' }
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
    taskDetailsHeader: 'Task Details',
    locationPrefix: 'Location: ',
    notesPrefix: 'Notes: ',
    selectInstruction: 'Select a calendar event to view details.',
    todayButton: 'Today',
    unscheduledTasksHeader: 'Unscheduled Tasks',
    noUnscheduledTasks: 'No unscheduled tasks.',
    
    // API/Guard errors
    fetchError: 'Cannot load calendar.'
  }
};
