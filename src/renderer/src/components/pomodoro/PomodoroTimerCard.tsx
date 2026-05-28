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
		<section className="w-full max-w-[480px] bg-[var(--color-bg)] rounded-2xl shadow-xl p-8 border border-[var(--color-border)] flex flex-col items-center gap-8">
			<div className="flex bg-[var(--color-surface)] p-1 rounded-lg w-full">
				{(['work', 'short_break', 'long_break'] as const).map((key) => (
					<button
						key={key}
						className={`flex-1 py-2 text-[15px] font-medium rounded-md transition-colors ${
							key === mode
								? 'bg-[var(--color-bg)] shadow-sm text-[var(--color-primary)]'
								: 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
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
					<circle cx="110" cy="110" r="90" fill="none" stroke="var(--color-primary-light)" strokeWidth="8" />
					<circle
						cx="110"
						cy="110"
						r="90"
						fill="none"
						stroke="var(--color-primary)"
						strokeWidth="8"
						strokeLinecap="round"
						className="timer-ring"
						style={{ strokeDasharray: 565, strokeDashoffset: dashOffset }}
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-5xl font-black text-[var(--color-text)] tracking-tight">
						{formatTime(remainingSeconds)}
					</span>
					<span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-widest">
						{modeDescriptions[mode]}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-8">
				<button
					className="h-12 w-12 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] transition-all active:scale-95"
					type="button"
					onClick={onReset}
				>
					<span className="material-symbols-outlined text-[28px]">refresh</span>
				</button>
				<button
					className="h-20 w-20 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-primary-hover)] transition-all active:scale-95"
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
					className="h-12 w-12 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] transition-all active:scale-95"
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
