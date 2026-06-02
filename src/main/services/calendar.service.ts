import { EventStatusColor } from '../constants/eventStatusColor';
import { todoService } from './todo.service';
import type { ITodo, TodoStatus } from '../models/Todo';

function startOfDay(value: Date): Date {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(value: Date): Date {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
}

function buildEventTimes(dueDate: Date): { startTime: Date; endTime: Date } {
  const startTime = startOfDay(dueDate);
  const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
  return { startTime, endTime };
}

function statusToColor(status: TodoStatus): string {
  const colors: Record<TodoStatus, string> = {
    pending: EventStatusColor.todo,
    completed: EventStatusColor.done,
    canceled: EventStatusColor.canceled
  };
  return colors[status] ?? EventStatusColor.todo;
}

function mapTodoToCalendarEvent(todo: ITodo) {
  if (!todo.dueDate) return null;
  
  let startTime: Date;
  let endTime: Date;
  
  if (todo.startDate) {
    startTime = new Date(todo.startDate);
    endTime = new Date(todo.dueDate);
  } else {
    const times = buildEventTimes(new Date(todo.dueDate));
    startTime = times.startTime;
    endTime = times.endTime;
  }

  return {
    _id: String(todo._id),
    title: todo.title,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    color: statusToColor(todo.status),
    userId: String(todo.userId),
    location: '',
    notes: todo.description ?? ''
  };
}

export class CalendarService {
  public async listEventsForDay(userId: string, date: Date) {
    const start = startOfDay(date);
    const end = endOfDay(date);
    const todos = await todoService.listTodos({ userId, dueDateFrom: start, dueDateTo: end });
    return todos
      .map(mapTodoToCalendarEvent)
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }

  public async listEventsInRange(userId: string, startDate: Date, endDate: Date) {
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new Error('Invalid date range.');
    }
    const todos = await todoService.listTodos({ userId, dueDateFrom: startDate, dueDateTo: endDate });
    return todos
      .map(mapTodoToCalendarEvent)
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }
}

export const calendarService = new CalendarService();
