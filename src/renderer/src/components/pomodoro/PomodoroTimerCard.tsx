import React from 'react';

type PomodoroTimerCardProps = {
	mode: 'work' | 'short_break' | 'long_break';
	remainingSeconds: number;
	totalSeconds: number;
	isRunning: boolean;
	onModeChange: (mode: 'work' | 'short_break' | 'long_break') => void;
	onStartPause: () => void;
	onReset: () => void;
	onSkip: () => void;
};

const modeLabels: Record<'work' | 'short_break' | 'long_break', string> = {
	work: 'Pomodoro',
	short_break: 'Nghỉ ngắn',
	long_break: 'Nghỉ dài'
};

const modeDescriptions: Record<'work' | 'short_break' | 'long_break', string> = {
	work: 'Thời gian làm việc',
	short_break: 'Thời gian nghỉ ngắn',
	long_break: 'Thời gian nghỉ dài'
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const PomodoroTimerCard = ({
	mode,
	remainingSeconds,
	totalSeconds,
	isRunning,
	onModeChange,
	onStartPause,
	onReset,
	onSkip
}: PomodoroTimerCardProps): React.JSX.Element => {
	const progress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
	const dashOffset = Math.round(565 * (1 - progress));

	return (
		<section className="w-full max-w-[480px] bg-white rounded-[48px] shadow-xl p-8 border border-[#E5E7EB] flex flex-col items-center gap-8">
			<div className="flex bg-[#F5F4FA] p-1 rounded-lg w-full">
				{(['work', 'short_break', 'long_break'] as const).map((key) => (
					<button
						key={key}
						className={`flex-1 py-2 text-[15px] font-medium rounded-lg transition-colors ${
							key === mode
								? 'bg-white shadow-sm text-[#4F3CC9]'
								: 'text-[#6B7280] hover:text-[#1A1A2E]'
						}`}
						type="button"
						onClick={() => onModeChange(key)}
					>
						{modeLabels[key]}
					</button>
				))}
			</div>

			<div className="relative flex items-center justify-center">
				<svg className="w-[220px] h-[220px] -rotate-90">
					<circle cx="110" cy="110" r="90" fill="none" stroke="#EDE9FF" strokeWidth="8" />
					<circle
						cx="110"
						cy="110"
						r="90"
						fill="none"
						stroke="#4F3CC9"
						strokeWidth="8"
						strokeLinecap="round"
						className="timer-ring"
						style={{ strokeDasharray: 565, strokeDashoffset: dashOffset }}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-[48px] font-black text-[#1A1A2E] tracking-tight">
						{formatTime(remainingSeconds)}
					</span>
					<span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-widest">
						{modeDescriptions[mode]}
					</span>
				</div>
			</div>

			<div className="w-full">
				<label className="block text-[12px] font-medium text-[#6B7280] mb-2">
					Đang thực hiện:
				</label>
				<div className="relative group cursor-pointer">
					<div className="flex items-center justify-between bg-[#F5F4FA] px-4 py-3 rounded-lg border border-transparent hover:border-[#4F3CC9]/30 transition-all">
						<div className="flex items-center gap-3">
							<span className="material-symbols-outlined text-[#4F3CC9]">list_alt</span>
							<span className="text-[14px] font-medium text-[#1A1A2E]">
								Thiết kế UI Dashboard FocusHub
							</span>
						</div>
						<span className="material-symbols-outlined text-[#6B7280]">expand_more</span>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-8">
				<button
					className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#F6F2FE] transition-all active:scale-95"
					type="button"
					onClick={onReset}
				>
					<span className="material-symbols-outlined text-[28px]">refresh</span>
				</button>
				<button
					className="h-20 w-20 rounded-full bg-[#4F3CC9] text-white flex items-center justify-center shadow-lg shadow-[#4F3CC9]/20 hover:bg-[#3A2D9E] transition-all active:scale-95"
					type="button"
					onClick={onStartPause}
				>
					<span
						className="material-symbols-outlined text-[40px]"
						style={{ fontVariationSettings: "'FILL' 1" }}
					>
						{isRunning ? 'pause' : 'play_arrow'}
					</span>
				</button>
				<button
					className="h-12 w-12 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#F6F2FE] transition-all active:scale-95"
					type="button"
					onClick={onSkip}
				>
					<span className="material-symbols-outlined text-[28px]">skip_next</span>
				</button>
			</div>
		</section>
	);
};

export default PomodoroTimerCard;
