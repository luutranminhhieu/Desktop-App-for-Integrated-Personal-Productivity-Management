import { ipcMain } from 'electron';
import { calendarService } from '../services/calendar.service';

export function registerCalendarIPC(): void {
  ipcMain.handle('calendar:create', async (_, payload) => {
    try {
      const data = await calendarService.createEvent(payload);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:list', async (_, { userId, date }) => {
    try {
      const targetDate = date ? new Date(date) : new Date();
      const data = await calendarService.listEventsForDay(userId, targetDate);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:update', async (_, { eventId, updates, userId }) => {
    try {
      const data = await calendarService.updateEvent(eventId, updates, userId);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('calendar:delete', async (_, { eventId, userId }) => {
    try {
      await calendarService.deleteEvent(eventId, userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
