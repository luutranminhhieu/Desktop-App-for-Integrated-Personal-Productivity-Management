import { ipcMain } from 'electron';
import { calendarService } from '../services/calendar.service';
import { noteService } from '../services/note.service';
import { todoService } from '../services/todo.service';

type FocusRange = 'week' | 'month' | 'year';

const focusRangeToDays = (range?: FocusRange): number => {
  switch (range) {
    case 'month':
      return 30;
    case 'year':
      return 365;
    case 'week':
    default:
      return 7;
  }
};

const formatTimeRange = (start: Date, end: Date): string => {
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
};

export function registerDashboardIPC(): void {
  ipcMain.handle('dashboard:getStats', async (_, { userId, focusRange }) => {
    try {
      const focusDays = focusRangeToDays(focusRange as FocusRange);
      const today = new Date();

      const [
        taskStats,
        focusHours,
        urgentTasks,
        todayTasks,
        noteCount,
        streak,
        activity,
        yearFocusHours,
        pomodoroStats,
        newNotesThisMonth,
        calendarEvents
      ] = await Promise.all([
        todoService.getTaskStats(userId),
        todoService.getFocusHours(userId, focusDays),
        todoService.getUrgentTasks(userId),
        todoService.getTodayTasks(userId),
        noteService.getNoteCount(userId),
        todoService.getFocusStreak(userId),
        todoService.getActivityHeatmap(userId, 12),
        todoService.getFocusHoursTotal(userId, 365),
        todoService.getPomodoroStatsToday(userId),
        noteService.getNewNotesCount(userId),
        calendarService.listEventsForDay(userId, today)
      ]);

      const weeklyFocusHours = focusHours.reduce((sum, day) => sum + day.hours, 0);
      const notifications = taskStats.urgent + taskStats.overdue;

      const timelineEvents = calendarEvents.map((event) => ({
        time: formatTimeRange(event.startTime, event.endTime),
        title: event.title,
        color: event.color
      }));

      return {
        success: true,
        data: {
          taskStats,
          focusHours,
          urgentTasks,
          todayTasks,
          noteCount,
          focusStreakDays: streak,
          weeklyFocusHours,
          activity,
          yearFocusHours,
          pomodoroStats,
          newNotesThisMonth,
          timelineEvents,
          notifications
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
