import type { TodoItem, TaskStats } from './todo';

/* ── Shared helpers ── */
export type FocusTime = {
  date: string;
  minutes: number;
};

export type TimelineEvent = {
  time: string;
  title: string;
  color: string;
};

/* ── Props for FocusDayCard ── */
export type FocusDayCardProps = {
  todayFocusMinutes: number;
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
  focusTime: FocusTime[];
  urgentTasks: TodoItem[];
  todayTasks: TodoItem[];
  weeklyFocusHours: number;
  activity: { startDate: string; values: number[] };
  timelineEvents: TimelineEvent[];
  yearFocusHours?: number;
};
