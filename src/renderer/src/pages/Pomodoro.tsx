import React, { useEffect } from 'react';
import PomodoroSettingsCard from '../components/pomodoro/PomodoroSettingsCard';
import PomodoroTimerCard from '../components/pomodoro/PomodoroTimerCard';
import { usePomodoro } from '../components/pomodoro/usePomodoro';

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
