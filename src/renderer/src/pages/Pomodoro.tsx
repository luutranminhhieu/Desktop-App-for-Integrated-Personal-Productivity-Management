import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PomodoroSettingsCard from '../components/pomodoro/PomodoroSettingsCard';
import PomodoroTimerCard from '../components/pomodoro/PomodoroTimerCard';
import type {
	PomodoroMode,
	PomodoroSettings,
	PomodoroStats,
	PomodoroState
} from '@renderer/types';

const defaultSettings: PomodoroSettings = {
	sessionsPerDay: 12,
	workMinutes: 25,
	shortBreakMinutes: 5
};

const defaultStats: PomodoroStats = {
	completedSessions: 0,
	targetSessions: 12
};

const defaultState: PomodoroState = {
	mode: 'work',
	remainingSeconds: 25 * 60,
	totalSeconds: 25 * 60,
	isRunning: false,
	settings: defaultSettings,
	stats: defaultStats
};

const usePomodoro = () => {
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

	const resetStats = useCallback(async () => {
		const response = await window.api.pomodoro.resetStats();
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
		() => ({ state, settings, stats, start, pause, reset, resetStats, skip, setMode, updateSettings }),
		[state, settings, stats, start, pause, reset, resetStats, skip, setMode, updateSettings]
	);
};

const Pomodoro = (): React.JSX.Element => {
	const { state, settings, stats, start, pause, reset, resetStats, skip, setMode, updateSettings } = usePomodoro();
	useEffect(() => {
		document.body.classList.add('focus-mode');
		return () => document.body.classList.remove('focus-mode');
	}, []);

	const handleAdjustSetting = (
		key: 'sessionsPerDay' | 'workMinutes' | 'shortBreakMinutes',
		delta: number
	): void => {
		const next = Math.max(1, settings[key] + delta);
		void updateSettings({ [key]: next });
	};

	const handleChangeSetting = (
		key: 'sessionsPerDay' | 'workMinutes' | 'shortBreakMinutes',
		value: number
	): void => {
		const next = Math.max(1, value);
		void updateSettings({ [key]: next });
	};

	const handleStartPause = (): void => {
		if (state.isRunning) {
			void pause();
			return;
		}
		void start();
	};

	return (
		<div className="-mt-5">
			<div className="mt-[60px] flex flex-col items-center px-8 pb-8">
				<div className="w-full max-w-[1200px]">
					<div className="flex flex-col items-center gap-8">
						<PomodoroTimerCard
							mode={state.mode}
							remainingSeconds={state.remainingSeconds}
							totalSeconds={state.totalSeconds}
							isRunning={state.isRunning}
							completedSessions={stats.completedSessions}
							targetSessions={stats.targetSessions}
							onModeChange={setMode}
							onStartPause={handleStartPause}
							onReset={() => void reset()}
							onSkip={() => void skip()}
							onResetStats={resetStats}
						/>
						<PomodoroSettingsCard
							settings={settings}
							onAdjust={handleAdjustSetting}
							onChangeSetting={handleChangeSetting}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Pomodoro;
