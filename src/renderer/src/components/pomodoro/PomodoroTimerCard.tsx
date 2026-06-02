import React, { useState, useEffect } from 'react';

type PomodoroTimerCardProps = {
	mode: 'work' | 'short_break';
	remainingSeconds: number;
	totalSeconds: number;
	isRunning: boolean;
	completedSessions: number;
	targetSessions: number;
	onModeChange: (mode: 'work' | 'short_break') => void;
	onStartPause: () => void;
	onReset: () => void;
	onSkip: () => void;
	onResetStats: () => void;
};

const modeLabels: Record<'work' | 'short_break' | 'sessions', string> = {
	work: 'Pomodoro',
	short_break: 'Break',
	sessions: 'Section'
};

const modeDescriptions: Record<'work' | 'short_break', string> = {
	work: '',
	short_break: ''
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
	completedSessions,
	targetSessions,
	onModeChange,
	onStartPause,
	onReset,
	onSkip,
	onResetStats
}: PomodoroTimerCardProps): React.JSX.Element => {
	const [activeTab, setActiveTab] = useState<'work' | 'short_break' | 'sessions'>('work');

	useEffect(() => {
		if (mode === 'work' || mode === 'short_break') {
			setActiveTab(mode);
		}
	}, [mode]);

	const handleTabClick = (tab: 'work' | 'short_break' | 'sessions'): void => {
		setActiveTab(tab);
		if (tab === 'work' || tab === 'short_break') {
			onModeChange(tab);
		}
	};

	const progress = activeTab === 'sessions'
		? (targetSessions > 0 ? completedSessions / targetSessions : 0)
		: (totalSeconds > 0 ? remainingSeconds / totalSeconds : 0);
	const dashOffset = Math.round(565 * (1 - progress));

	return (
		<section className="w-full max-w-[480px] bg-[var(--color-bg)] rounded-2xl shadow-xl p-8 border border-[var(--color-border)] flex flex-col items-center gap-8">
			<div className="flex bg-[var(--color-surface)] p-1 rounded-lg w-full">
				{(['work', 'short_break', 'sessions'] as const).map((key) => (
					<button
						key={key}
						className={`flex-1 py-2 text-[15px] font-medium rounded-md transition-colors ${
							key === activeTab
								? 'bg-[var(--color-bg)] shadow-sm text-[var(--color-primary)]'
								: 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
						}`}
						type="button"
						onClick={() => handleTabClick(key)}
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
					{activeTab === 'sessions' ? (
						<>
							<span className="material-symbols-outlined text-[44px] text-[var(--color-primary)] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
								timer
							</span>
							<span className="text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
								{completedSessions} / {targetSessions}
							</span>
							<span className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mt-1">
							</span>
						</>
					) : (
						<>
							<span className="text-5xl font-black text-[var(--color-text)] tracking-tight">
								{formatTime(remainingSeconds)}
							</span>
							<span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-widest mt-1">
								{modeDescriptions[activeTab]}
							</span>
						</>
					)}
				</div>
			</div>

			{activeTab === 'sessions' ? (
				<button
					className="flex items-center justify-center gap-2 border border-[var(--color-border)] hover:bg-[var(--color-primary-light)] text-[var(--color-primary)] px-6 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
					type="button"
					onClick={onResetStats}
				>
					<span className="material-symbols-outlined text-[20px]">refresh</span>
				</button>
			) : (
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
			)}
		</section>
	);
};

export default PomodoroTimerCard;
