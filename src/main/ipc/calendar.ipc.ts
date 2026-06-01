import { ipcMain } from 'electron';
import { calendarService } from '../services/calendar.service';
import { logger } from '../utils/logger';

export function registerCalendarIPC(): void {
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
}
