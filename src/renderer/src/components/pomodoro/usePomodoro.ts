import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
	PomodoroMode,
	PomodoroSettings,
	PomodoroStats,
	PomodoroState,
	PomodoroHook
} from '@renderer/types';

const defaultSettings: PomodoroSettings = {
	sessionsPerDay: 12,
	workMinutes: 25,
	shortBreakMinutes: 5,
	longBreakMinutes: 15
};

const defaultStats: PomodoroStats = {
	completedSessions: 0,
	targetSessions: 12,
	totalWorkSeconds: 0,
	totalBreakSeconds: 0
};

const defaultState: PomodoroState = {
	mode: 'work',
	remainingSeconds: 25 * 60,
	totalSeconds: 25 * 60,
	isRunning: false,
	settings: defaultSettings,
	stats: defaultStats
};

export const usePomodoro = (): PomodoroHook => {
	const [state, setState] = useState<PomodoroState>(defaultState);
	const [settings, setSettings] = useState<PomodoroSettings>(defaultSettings);
	const [stats, setStats] = useState<PomodoroStats>(defaultStats);

	const hydrateState = useCallback((next?: PomodoroState): void => {
		if (!next) {
			return;
		}
		setState(next);
		setSettings(next.settings);
		setStats(next.stats);
	}, []);

	useEffect(() => {
		let unsubscribeTick: (() => void) | undefined;
		let unsubscribeEnded: (() => void) | undefined;

		const init = async (): Promise<void> => {
			const response = await window.api.pomodoro.getState();
			if (response.success) {
				hydrateState(response.data);
			}
			unsubscribeTick = window.api.pomodoro.onTick((payload) => {
				hydrateState(payload);
			});
			unsubscribeEnded = window.api.pomodoro.onSessionEnded(() => {
				// No-op placeholder for future toasts or sounds.
			});
		};

		void init();

		return () => {
			unsubscribeTick?.();
			unsubscribeEnded?.();
		};
	}, [hydrateState]);

	const start = useCallback(async () => {
		const response = await window.api.pomodoro.start();
		if (response.success) {
			hydrateState(response.data);
		}
	}, [hydrateState]);

	const pause = useCallback(async () => {
		const response = await window.api.pomodoro.pause();
		if (response.success) {
			hydrateState(response.data);
		}
	}, [hydrateState]);

	const reset = useCallback(async () => {
		const response = await window.api.pomodoro.reset();
		if (response.success) {
			hydrateState(response.data);
		}
	}, [hydrateState]);

	const skip = useCallback(async () => {
		const response = await window.api.pomodoro.skip();
		if (response.success) {
			hydrateState(response.data);
		}
	}, [hydrateState]);

	const setMode = useCallback(
		async (mode: PomodoroMode) => {
			const response = await window.api.pomodoro.setMode(mode);
			if (response.success) {
				hydrateState(response.data);
			}
		},
		[hydrateState]
	);

	const updateSettings = useCallback(
		async (patch: Partial<PomodoroSettings>) => {
			const response = await window.api.pomodoro.updateSettings(patch);
			if (response.success) {
				setSettings(response.data ?? settings);
			}
		},
		[settings]
	);

	return useMemo(
		() => ({ state, settings, stats, start, pause, reset, skip, setMode, updateSettings }),
		[state, settings, stats, start, pause, reset, skip, setMode, updateSettings]
	);
};
