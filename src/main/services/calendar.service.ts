import mongoose from 'mongoose';
import { CalendarEvent, ICalendarEvent } from '../models/CalendarEvent';

const DEFAULT_LIST_LIMIT = 200;

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

export class CalendarService {
  public async createEvent(payload: Partial<ICalendarEvent>): Promise<ICalendarEvent> {
    if (!payload.title) {
      throw new Error('Title is required.');
    }
    if (!payload.userId) {
      throw new Error('User is required.');
    }
    if (!payload.startTime || !payload.endTime) {
      throw new Error('Start and end time are required.');
    }

    const status = payload.status || 'confirmed';
    const statusColors: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      tentative: '#10B981',
      canceled: '#EF4444',
      completed: '#6B7280'
    };

    if (!payload.color || payload.color === '#4F3CC9') {
      payload.color = statusColors[status] || '#3B82F6';
    }

    return CalendarEvent.create(payload);
  }

  public async listEvents(userId: string, limit = DEFAULT_LIST_LIMIT): Promise<ICalendarEvent[]> {
    return CalendarEvent.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ startTime: 1 })
      .limit(limit);
  }

  public async listEventsForDay(userId: string, date: Date): Promise<ICalendarEvent[]> {
    const start = startOfDay(date);
    const end = endOfDay(date);
    return CalendarEvent.find({
      userId: new mongoose.Types.ObjectId(userId),
      startTime: { $gte: start, $lte: end }
    }).sort({ startTime: 1 });
  }

  public async listEventsInRange(userId: string, startDate: Date, endDate: Date): Promise<ICalendarEvent[]> {
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw new Error('Invalid date range.');
    }

    return CalendarEvent.find({
      userId: new mongoose.Types.ObjectId(userId),
      startTime: { $gte: startDate, $lt: endDate }
    }).sort({ startTime: 1 });
  }

  public async updateEvent(eventId: string, updates: Partial<ICalendarEvent>, userId: string): Promise<ICalendarEvent> {
    const statusColors: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      tentative: '#10B981',
      canceled: '#EF4444',
      completed: '#6B7280'
    };

    if (updates.status && (!updates.color || updates.color === '#4F3CC9')) {
      updates.color = statusColors[updates.status];
    }

    const event = await CalendarEvent.findOneAndUpdate(
      { _id: eventId, userId: new mongoose.Types.ObjectId(userId) },
      updates,
      { new: true }
    );

    if (!event) {
      throw new Error('Calendar event not found.');
    }

    return event;
  }

  public async deleteEvent(eventId: string, userId: string): Promise<void> {
    const result = await CalendarEvent.findOneAndDelete({ _id: eventId, userId: new mongoose.Types.ObjectId(userId) });
    if (!result) {
      throw new Error('Calendar event not found.');
    }
  }
}

export const calendarService = new CalendarService();
