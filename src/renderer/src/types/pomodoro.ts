export type PomodoroMode = 'work' | 'short_break';

export type PomodoroSettings = {
	sessionsPerDay: number;
	workMinutes: number;
	shortBreakMinutes: number;
};

export type PomodoroStats = {
	completedSessions: number;
	targetSessions: number;
};

export type PomodoroState = {
	mode: PomodoroMode;
	remainingSeconds: number;
	totalSeconds: number;
	isRunning: boolean;
	settings: PomodoroSettings;
	stats: PomodoroStats;
};

export type PomodoroHook = {
	state: PomodoroState;
	settings: PomodoroSettings;
	stats: PomodoroStats;
	start: () => Promise<void>;
	pause: () => Promise<void>;
	reset: () => Promise<void>;
	resetStats: () => Promise<void>;
	skip: () => Promise<void>;
	setMode: (mode: PomodoroMode) => Promise<void>;
	updateSettings: (patch: Partial<PomodoroSettings>) => Promise<void>;
};
