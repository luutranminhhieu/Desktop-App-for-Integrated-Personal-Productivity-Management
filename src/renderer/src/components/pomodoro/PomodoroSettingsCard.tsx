import React from 'react';

type PomodoroSettingsCardProps = {
	settings: {
		sessionsPerDay: number;
		workMinutes: number;
		shortBreakMinutes: number;
	};
	onAdjust: (key: 'sessionsPerDay' | 'workMinutes' | 'shortBreakMinutes', delta: number) => void;
};

const PomodoroSettingsCard = ({ settings, onAdjust }: PomodoroSettingsCardProps): React.JSX.Element => {
	const items = [
		{
			key: 'sessionsPerDay',
			title: 'Số phiên làm việc',
			subtitle: 'Tổng cộng cho hôm nay',
			value: settings.sessionsPerDay
		},
		{
			key: 'workMinutes',
			title: 'Làm việc (phút)',
			subtitle: 'Thời gian tập trung tối đa',
			value: settings.workMinutes
		},
		{
			key: 'shortBreakMinutes',
			title: 'Nghỉ giải lao (phút)',
			subtitle: 'Nghỉ ngắn sau mỗi phiên',
			value: settings.shortBreakMinutes
		}
	] as const;

	return (
		<section className="w-full max-w-[480px] bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-6">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
					<span className="material-symbols-outlined text-[var(--color-primary)]">tune</span>
					Thiết lập phiên
				</h3>
			</div>
			<div className="space-y-4">
				{items.map((item, index) => (
					<React.Fragment key={item.title}>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-[15px] font-medium text-[var(--color-text)]">{item.title}</p>
								<p className="text-xs font-medium text-[var(--color-muted)]">{item.subtitle}</p>
							</div>
							<div className="flex items-center gap-3 bg-[var(--color-surface)] rounded-lg p-1">
								<button
									className="h-8 w-8 rounded bg-[var(--color-bg)] shadow-sm flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)]"
									type="button"
									onClick={() => onAdjust(item.key, -1)}
								>
									-
								</button>
								<span className="text-[15px] font-medium text-[var(--color-text)] px-3">
									{item.value.toString().padStart(2, '0')}
								</span>
								<button
									className="h-8 w-8 rounded bg-[var(--color-bg)] shadow-sm flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)]"
									type="button"
									onClick={() => onAdjust(item.key, 1)}
								>
									+
								</button>
							</div>
						</div>
						{index < items.length - 1 && <div className="h-px bg-[var(--color-border)]" />}
					</React.Fragment>
				))}
			</div>
		</section>
	);
};

export default PomodoroSettingsCard;
