import { ipcMain } from 'electron';
import { noteService } from '../services/note.service';
import { todoService } from '../services/todo.service';

export function registerDashboardIPC(): void {
  ipcMain.handle('dashboard:getStats', async (_, { userId }) => {
    try {
      const [taskStats, focusHours, urgentTasks, todayTasks, noteCount, streak, activity, yearFocusHours] = await Promise.all([
        todoService.getTaskStats(userId),
        todoService.getFocusHours(userId, 7),
        todoService.getUrgentTasks(userId),
        todoService.getTodayTasks(userId),
        noteService.getNoteCount(userId),
        todoService.getFocusStreak(userId),
        todoService.getActivityHeatmap(userId, 12),
        todoService.getFocusHoursTotal(userId, 365)
      ]);

      const weeklyFocusHours = focusHours.reduce((sum, day) => sum + day.hours, 0);
      const notifications = taskStats.urgent + taskStats.overdue;

      const timelineEvents = [
        { time: '09:00 - 10:30', title: 'Họp chiến lược Marketing', color: '#4F3CC9' },
        { time: '11:00 - 12:00', title: 'Deep Work Session 1', color: '#E5E7EB' },
        { time: '14:00 - 15:30', title: 'Design Critique Meeting', color: '#7C3AED' },
        { time: '16:00 - 17:00', title: 'Trình bày Proposal', color: '#E5E7EB' }
      ];

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
          timelineEvents,
          notifications
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}
