import { ipcMain } from 'electron';
import { calendarService } from '../services/calendar.service';
import { todoService } from '../services/todo.service';
import { logger } from '../utils/logger';

const formatTimeRange = (start: Date, end: Date): string => {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
};

export function registerDashboardIPC(): void {
  ipcMain.handle('dashboard:getStats', async (_, { userId }) => {
    try {
      const today = new Date();

      const [
        taskStats,
        todayTasks,
        activity,
        calendarEvents
      ] = await Promise.all([
        todoService.getTaskStats(userId),
        todoService.getTodayTasks(userId),
        todoService.getActivityHeatmap(userId, 12),
        calendarService.listEventsForDay(userId, today)
      ]);

      const notifications = taskStats.overdue;

      const timelineEvents = calendarEvents.map((event) => ({
        time: formatTimeRange(new Date(event.startTime), new Date(event.endTime)),
        title: event.title,
        color: event.color
      }));

      return {
        success: true,
        data: {
          taskStats,
          todayTasks,
          activity,
          timelineEvents,
          notifications
        }
      };
    } catch (error) {
      logger.error('Error in dashboard:getStats', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
