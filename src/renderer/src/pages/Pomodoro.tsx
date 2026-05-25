import React, { useEffect } from 'react';
import PomodoroSettingsCard from '../components/pomodoro/PomodoroSettingsCard';
import PomodoroStatsRow from '../components/pomodoro/PomodoroStatsRow';
import PomodoroTimerCard from '../components/pomodoro/PomodoroTimerCard';
const Pomodoro = (): React.JSX.Element => {
	useEffect(() => {
		document.body.classList.add('focus-mode');
		return () => document.body.classList.remove('focus-mode');
	}, []);

	return (
		<div className="-mt-5">
			<div className="mt-[60px] flex flex-col items-center px-8 pb-8">
				<div className="w-full max-w-[1200px]">
					<div className="flex flex-col items-center gap-8">
						<PomodoroStatsRow />
						<PomodoroTimerCard />
						<PomodoroSettingsCard />
					</div>
				</div>
			</div>
			<button
				className="fixed bottom-8 right-8 h-[52px] w-[52px] rounded-full bg-[#4F3CC9] text-white shadow-xl flex items-center justify-center active:scale-95 transition-all hover:bg-[#3A2D9E] z-20"
				type="button"
			>
				<span className="material-symbols-outlined text-[28px]">add</span>
			</button>
		</div>
	);
};

export default Pomodoro;
