import React, { useEffect, useMemo } from 'react';
import PomodoroSettingsCard from '../components/pomodoro/PomodoroSettingsCard';
import PomodoroStatsRow from '../components/pomodoro/PomodoroStatsRow';
import PomodoroTimerCard from '../components/pomodoro/PomodoroTimerCard';
import { usePomodoro } from '../components/pomodoro/usePomodoro';

const formatHoursMinutes = (totalSeconds: number): string => {
	const totalMinutes = Math.floor(totalSeconds / 60);
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const Pomodoro = (): React.JSX.Element => {
	const { state, settings, stats, start, pause, reset, skip, setMode, updateSettings } = usePomodoro();
	useEffect(() => {
		document.body.classList.add('focus-mode');
		return () => document.body.classList.remove('focus-mode');
	}, []);

	const statItems = useMemo(
		() => [
			{
				icon: 'timer',
				label: 'Phiên tập trung',
				value: `${stats.completedSessions} / ${stats.targetSessions}`
			},
			{ icon: 'bolt', label: 'Tổng thời gian', value: formatHoursMinutes(stats.totalWorkSeconds) },
			{ icon: 'bedtime', label: 'Thời gian nghỉ', value: formatHoursMinutes(stats.totalBreakSeconds) }
		],
		[stats]
	);

	const handleAdjustSetting = (
		key: 'sessionsPerDay' | 'workMinutes' | 'shortBreakMinutes',
		delta: number
	): void => {
		const next = Math.max(1, settings[key] + delta);
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
						<PomodoroStatsRow items={statItems} />
						<PomodoroTimerCard
							mode={state.mode}
							remainingSeconds={state.remainingSeconds}
							totalSeconds={state.totalSeconds}
							isRunning={state.isRunning}
							onModeChange={setMode}
							onStartPause={handleStartPause}
							onReset={() => void reset()}
							onSkip={() => void skip()}
						/>
						<PomodoroSettingsCard settings={settings} onAdjust={handleAdjustSetting} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Pomodoro;
