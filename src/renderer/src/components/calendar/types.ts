export type CalendarViewType = 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth';

export type CalendarEventRecord = {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  userId: string;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CalendarFormData = {
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  location: string;
  notes: string;
};

export type CalendarModalMode = 'create' | 'edit';

export type UnscheduledTask = {
  _id: string;
  title: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  project?: string;
  dueDate?: string;
};
