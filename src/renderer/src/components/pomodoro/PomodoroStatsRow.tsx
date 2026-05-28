import React from 'react';

type PomodoroStatItem = {
	icon: string;
	label: string;
	value: string;
};

type PomodoroStatsRowProps = {
	items: PomodoroStatItem[];
};

const PomodoroStatsRow = ({ items }: PomodoroStatsRowProps): React.JSX.Element => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
			{items.map((item) => (
				<div
					key={item.label}
					className="bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)] flex items-center gap-4"
				>
					<div className="h-12 w-12 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)]">
						<span className="material-symbols-outlined">{item.icon}</span>
					</div>
					<div>
						<p className="text-xs font-medium text-[var(--color-muted)]">{item.label}</p>
						<h2 className="text-lg font-semibold text-[var(--color-text)]">{item.value}</h2>
					</div>
				</div>
			))}
		</div>
	);
};

export default PomodoroStatsRow;
