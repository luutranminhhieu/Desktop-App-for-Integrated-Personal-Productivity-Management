import type { TodoItem, TaskStats } from './todo';

/* ── Shared helpers ── */
export type FocusDay = {
  date: string;
  hours: number;
};

export type TimelineEvent = {
  time: string;
  title: string;
  color: string;
};

/* ── Props for FocusDayCard ── */
export type FocusDayCardProps = {
  todayFocusHours: number;
  focusGoal: number;
  pomodoroCompleted: number;
  pomodoroTarget: number;
};

/* ── Props for TaskStatusDonut ── */
export type TaskStatusProps = {
  taskStats: TaskStats;
};

/* ── Props for Heatmap ── */
export type HeatmapProps = {
  /** ISO date string for the first day of the dataset */
  startDate: string;
  /** 365 values (0‑based index = day offset from startDate) */
  values: number[];
};

/* ── Aggregated dashboard payload from API ── */
export type DashboardData = {
  taskStats: TaskStats;
  focusHours: FocusDay[];
  urgentTasks: TodoItem[];
  todayTasks: TodoItem[];
  pomodoroStats: { completed: number; target: number };
  focusStreakDays: number;
  weeklyFocusHours: number;
  activity: { startDate: string; values: number[] };
  timelineEvents: TimelineEvent[];
  yearFocusHours?: number;
};
