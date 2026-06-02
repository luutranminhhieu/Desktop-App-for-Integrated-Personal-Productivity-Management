export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export type TodoStatus = 'pending' | 'completed' | 'canceled';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TodoItem {
  _id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  startDate?: string;
  columnId?: number;
  tags: string[];
  userId: string;
  project?: string;
  focusMinutes: number;
  focusDate?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  urgent: number;
  canceled: number;
  tasksThisMonth: number;
}


export interface FocusTime {
  date: string;
  minutes: number;
}

export interface HeatmapData {
  startDate: string;
  values: number[];
}

export type PomodoroMode = 'work' | 'short_break';

export interface PomodoroSettings {
  sessionsPerDay: number;
  workMinutes: number;
  shortBreakMinutes: number;
}

export interface PomodoroStats {
  completedSessions: number;
  targetSessions: number;
  totalWorkSeconds: number;
  totalBreakSeconds: number;
}

export interface PomodoroState {
  mode: PomodoroMode;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  settings: PomodoroSettings;
  stats: PomodoroStats;
}

export interface TimelineEvent {
  time: string;
  title: string;
  color: string;
}

export interface DashboardStats {
  taskStats: TaskStats;
  focusTime: FocusTime[];
  urgentTasks: TodoItem[];
  todayTasks: TodoItem[];
  weeklyFocusHours: number;
  activity: HeatmapData;
  timelineEvents: TimelineEvent[];
  notifications: number;
  yearFocusHours: number;
}

export interface CalendarEvent {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  userId: string;
  location?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthAPI {
  login: (email: string, password: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; data?: TokenPayload; error?: string }>;
  googleSignIn: () => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

export interface IAppAPI {
  onDeepLink: (callback: (url: string) => void) => () => void;
}

export interface IPomodoroAPI {
  getState: () => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  getSettings: () => Promise<{ success: boolean; data?: PomodoroSettings; error?: string }>;
  updateSettings: (settings: Partial<PomodoroSettings>) => Promise<{ success: boolean; data?: PomodoroSettings; error?: string }>;
  start: () => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  pause: () => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  reset: () => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  resetStats: () => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  skip: () => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  setMode: (mode: PomodoroMode) => Promise<{ success: boolean; data?: PomodoroState; error?: string }>;
  onTick: (callback: (state: PomodoroState) => void) => () => void;
  onSessionEnded: (callback: (payload: { mode: PomodoroMode; nextMode: PomodoroMode }) => void) => () => void;
}

export interface ITodoAPI {
  create: (payload: Partial<TodoItem>) => Promise<{ success: boolean; data?: TodoItem; error?: string }>;
  list: (options: {
    userId: string;
    status?: TodoStatus;
    priority?: TodoPriority;
    tags?: string[];
    query?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    limit?: number;
  }) => Promise<{ success: boolean; data?: TodoItem[]; error?: string }>;
  update: (todoId: string, updates: Partial<TodoItem>, userId: string) => Promise<{ success: boolean; data?: TodoItem; error?: string }>;
  delete: (todoId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  stats: (userId: string) => Promise<{ success: boolean; data?: TaskStats; error?: string }>;
}

export interface IDashboardAPI {
  getStats: (
    userId: string,
    focusRange?: 'week' | 'month' | 'year'
  ) => Promise<{ success: boolean; data?: DashboardStats; error?: string }>;
}

export interface ICalendarAPI {
  list: (userId: string, date?: string) => Promise<{ success: boolean; data?: CalendarEvent[]; error?: string }>;
  listRange: (
    userId: string,
    startDate: string,
    endDate: string
  ) => Promise<{ success: boolean; data?: CalendarEvent[]; error?: string }>;
}

declare global {
  interface Window {
    api: {
      auth: IAuthAPI;
      todo: ITodoAPI;
      dashboard: IDashboardAPI;
      calendar: ICalendarAPI;
      pomodoro: IPomodoroAPI;
      app: IAppAPI;
    }
  }
}