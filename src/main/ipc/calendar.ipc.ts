import { ipcMain } from 'electron';
import mongoose from 'mongoose';
import { calendarService } from '../services/calendar.service';
import { CreateCalendarEventSchema, UpdateCalendarEventSchema } from '../utils/validation';
import { logger } from '../utils/logger';

export function registerCalendarIPC(): void {
  ipcMain.handle('calendar:create', async (_, payload) => {
    try {
      const parsed = CreateCalendarEventSchema.parse(payload);
      const validatedPayload = {
        ...parsed,
        userId: new mongoose.Types.ObjectId(parsed.userId)
      } as any;
      const data = await calendarService.createEvent(validatedPayload);
      return { success: true, data };
    } catch (error) {
      logger.error('Error in calendar:create', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:list', async (_, { userId, date }) => {
    try {
      const targetDate = date ? new Date(date) : new Date();
      const data = await calendarService.listEventsForDay(userId, targetDate);
      return { success: true, data };
    } catch (error) {
      logger.error('Error in calendar:list', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:listRange', async (_, { userId, startDate, endDate }) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const data = await calendarService.listEventsInRange(userId, start, end);
      return { success: true, data };
    } catch (error) {
      logger.error('Error in calendar:listRange', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:update', async (_, { eventId, updates, userId }) => {
    try {
      const validated = UpdateCalendarEventSchema.parse({ eventId, updates, userId });
      const data = await calendarService.updateEvent(validated.eventId, validated.updates, validated.userId);
      return { success: true, data };
    } catch (error) {
      logger.error('Error in calendar:update', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:delete', async (_, { eventId, userId }) => {
    try {
      await calendarService.deleteEvent(eventId, userId);
      return { success: true };
    } catch (error) {
      logger.error('Error in calendar:delete', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
