import { app, BrowserWindow, Notification } from 'electron';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

export type PomodoroMode = 'work' | 'short_break' | 'long_break';

export type PomodoroSettings = {
	sessionsPerDay: number;
	workMinutes: number;
	shortBreakMinutes: number;
	longBreakMinutes: number;
};

export type PomodoroSession = {
	mode: PomodoroMode;
	durationSeconds: number;
	completedAt: string;
};

export type PomodoroStats = {
	completedSessions: number;
	targetSessions: number;
	totalWorkSeconds: number;
	totalBreakSeconds: number;
};

export type PomodoroState = {
	mode: PomodoroMode;
	remainingSeconds: number;
	totalSeconds: number;
	isRunning: boolean;
	settings: PomodoroSettings;
	stats: PomodoroStats;
};

type PomodoroStore = {
	settings: PomodoroSettings;
	history: PomodoroSession[];
};

const DEFAULT_SETTINGS: PomodoroSettings = {
	sessionsPerDay: 12,
	workMinutes: 25,
	shortBreakMinutes: 5,
	longBreakMinutes: 15
};

const LONG_BREAK_EVERY = 4;

class PomodoroService {
	private readonly storePath: string;
	private settings: PomodoroSettings = { ...DEFAULT_SETTINGS };
	private history: PomodoroSession[] = [];
	private mode: PomodoroMode = 'work';
	private remainingSeconds = DEFAULT_SETTINGS.workMinutes * 60;
	private totalSeconds = DEFAULT_SETTINGS.workMinutes * 60;
	private isRunning = false;
	private interval: NodeJS.Timeout | null = null;
	private currentSessionSeconds = this.totalSeconds;
	private completedSinceLongBreak = 0;

	constructor() {
		this.storePath = path.join(app.getPath('userData'), 'pomodoro.json');
		void this.loadStore();
	}

	public getState(): PomodoroState {
		return {
			mode: this.mode,
			remainingSeconds: this.remainingSeconds,
			totalSeconds: this.totalSeconds,
			isRunning: this.isRunning,
			settings: this.settings,
			stats: this.buildStats()
		};
	}

	public getSettings(): PomodoroSettings {
		return this.settings;
	}

	public async updateSettings(partial: Partial<PomodoroSettings>): Promise<PomodoroSettings> {
		this.settings = this.normalizeSettings({ ...this.settings, ...partial });
		if (!this.isRunning) {
			this.setMode(this.mode);
		}
		await this.writeStore();
		this.emitState();
		return this.settings;
	}

	public start(): PomodoroState {
		if (this.isRunning) {
			return this.getState();
		}
		this.isRunning = true;
		this.currentSessionSeconds = this.totalSeconds;
		this.interval = setInterval(() => this.tick(), 1000);
		this.emitState();
		return this.getState();
	}

	public pause(): PomodoroState {
		if (!this.isRunning) {
			return this.getState();
		}
		this.isRunning = false;
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		this.emitState();
		return this.getState();
	}

	public reset(): PomodoroState {
		this.pause();
		this.remainingSeconds = this.totalSeconds;
		this.currentSessionSeconds = this.totalSeconds;
		this.emitState();
		return this.getState();
	}

	public skip(): PomodoroState {
		this.pause();
		this.advanceMode();
		this.emitState();
		return this.getState();
	}

	public setMode(mode: PomodoroMode): PomodoroState {
		this.mode = mode;
		this.totalSeconds = this.durationForMode(mode);
		this.remainingSeconds = this.totalSeconds;
		this.currentSessionSeconds = this.totalSeconds;
		this.emitState();
		return this.getState();
	}

	private tick(): void {
		if (!this.isRunning) {
			return;
		}
		this.remainingSeconds = Math.max(0, this.remainingSeconds - 1);
		if (this.remainingSeconds <= 0) {
			this.handleSessionEnd();
			return;
		}
		this.emitState();
	}

	private handleSessionEnd(): void {
		this.pause();
		const session: PomodoroSession = {
			mode: this.mode,
			durationSeconds: this.currentSessionSeconds,
			completedAt: new Date().toISOString()
		};
		this.history.unshift(session);
		this.history = this.history.slice(0, 200);
		void this.writeStore();
		this.advanceMode();
		this.notifySessionEnd(session.mode);
		this.emitSessionEnded(session.mode);
	}

	private advanceMode(): void {
		if (this.mode === 'work') {
			this.completedSinceLongBreak += 1;
			const isLongBreak = this.completedSinceLongBreak % LONG_BREAK_EVERY === 0;
			this.mode = isLongBreak ? 'long_break' : 'short_break';
			if (isLongBreak) {
				this.completedSinceLongBreak = 0;
			}
		} else {
			this.mode = 'work';
		}
		this.totalSeconds = this.durationForMode(this.mode);
		this.remainingSeconds = this.totalSeconds;
		this.currentSessionSeconds = this.totalSeconds;
	}

	private durationForMode(mode: PomodoroMode): number {
		if (mode === 'short_break') {
			return this.settings.shortBreakMinutes * 60;
		}
		if (mode === 'long_break') {
			return this.settings.longBreakMinutes * 60;
		}
		return this.settings.workMinutes * 60;
	}

	private buildStats(): PomodoroStats {
		let completedSessions = 0;
		let totalWorkSeconds = 0;
		let totalBreakSeconds = 0;

		const today = new Date();
		const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

		for (const session of this.history) {
			const completedTime = new Date(session.completedAt).getTime();
			if (completedTime >= start.getTime() && completedTime <= end.getTime()) {
				if (session.mode === 'work') {
					completedSessions += 1;
					totalWorkSeconds += session.durationSeconds;
				} else {
					totalBreakSeconds += session.durationSeconds;
				}
			}
		}

		return {
			completedSessions,
			targetSessions: this.settings.sessionsPerDay,
			totalWorkSeconds,
			totalBreakSeconds
		};
	}

	private emitState(): void {
		const payload = this.getState();
		BrowserWindow.getAllWindows().forEach((win) => {
			win.webContents.send('pomodoro:tick', payload);
		});
	}

	private emitSessionEnded(mode: PomodoroMode): void {
		BrowserWindow.getAllWindows().forEach((win) => {
			win.webContents.send('pomodoro:sessionEnded', { mode, nextMode: this.mode });
		});
	}

	private notifySessionEnd(mode: PomodoroMode): void {
		if (!Notification.isSupported()) {
			return;
		}
		const title = mode === 'work' ? 'Hoàn thành phiên tập trung' : 'Kết thúc nghỉ giải lao';
		const body = mode === 'work'
			? 'Bạn đã hoàn thành một phiên Pomodoro.'
			: 'Sẵn sàng trở lại với công việc.';
		new Notification({ title, body }).show();
	}

	private normalizeSettings(settings: PomodoroSettings): PomodoroSettings {
		return {
			sessionsPerDay: Math.max(1, Math.floor(settings.sessionsPerDay)),
			workMinutes: Math.max(1, Math.floor(settings.workMinutes)),
			shortBreakMinutes: Math.max(1, Math.floor(settings.shortBreakMinutes)),
			longBreakMinutes: Math.max(1, Math.floor(settings.longBreakMinutes))
		};
	}

	private async loadStore(): Promise<void> {
		try {
			if (!existsSync(this.storePath)) {
				await this.writeStore();
				return;
			}
			const raw = await readFile(this.storePath, 'utf-8');
			const parsed = JSON.parse(raw) as PomodoroStore;
			this.settings = this.normalizeSettings(parsed.settings ?? DEFAULT_SETTINGS);
			this.history = Array.isArray(parsed.history) ? parsed.history : [];
			this.mode = 'work';
			this.totalSeconds = this.durationForMode(this.mode);
			this.remainingSeconds = this.totalSeconds;
			this.currentSessionSeconds = this.totalSeconds;
			this.completedSinceLongBreak = this.countSessionsSinceLongBreak();
		} catch {
			this.settings = { ...DEFAULT_SETTINGS };
			this.history = [];
			this.mode = 'work';
			this.totalSeconds = this.durationForMode(this.mode);
			this.remainingSeconds = this.totalSeconds;
			this.currentSessionSeconds = this.totalSeconds;
			this.completedSinceLongBreak = 0;
		}
	}

	private countSessionsSinceLongBreak(): number {
		let count = 0;
		for (const session of this.history) {
			if (session.mode === 'long_break') {
				break;
			}
			if (session.mode === 'work') {
				count += 1;
			}
		}
		return count;
	}

	private async writeStore(): Promise<void> {
		const payload: PomodoroStore = {
			settings: this.settings,
			history: this.history
		};
		await writeFile(this.storePath, JSON.stringify(payload, null, 2), 'utf-8');
	}
}

export const pomodoroService = new PomodoroService();
