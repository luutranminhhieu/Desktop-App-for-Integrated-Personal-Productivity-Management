import React, { useEffect, useState } from 'react';

type PomodoroSettingsCardProps = {
	settings: {
		sessionsPerDay: number;
		workMinutes: number;
		shortBreakMinutes: number;
	};
	onAdjust: (key: 'sessionsPerDay' | 'workMinutes' | 'shortBreakMinutes', delta: number) => void;
	onChangeSetting?: (key: 'sessionsPerDay' | 'workMinutes' | 'shortBreakMinutes', value: number) => void;
};

const PomodoroSettingsCard = ({ settings, onAdjust, onChangeSetting }: PomodoroSettingsCardProps): React.JSX.Element => {
	const [localValues, setLocalValues] = useState({
		sessionsPerDay: settings.sessionsPerDay.toString(),
		workMinutes: settings.workMinutes.toString(),
		shortBreakMinutes: settings.shortBreakMinutes.toString()
	});

	useEffect(() => {
		setLocalValues({
			sessionsPerDay: settings.sessionsPerDay.toString(),
			workMinutes: settings.workMinutes.toString(),
			shortBreakMinutes: settings.shortBreakMinutes.toString()
		});
	}, [settings]);

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
			title: 'Thời gian nghỉ (phút)',
			subtitle: 'Thời gian nghỉ sau mỗi phiên',
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
									className="h-8 w-8 rounded bg-[var(--color-bg)] shadow-sm flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] cursor-pointer"
									type="button"
									onClick={() => onAdjust(item.key, -1)}
								>
									-
								</button>
								<input
									type="text"
									inputMode="numeric"
									pattern="[0-9]*"
									value={localValues[item.key]}
									onChange={(e) => {
										const text = e.target.value.replace(/\D/g, ''); // Allow only digits
										setLocalValues((prev) => ({ ...prev, [item.key]: text }));

										const val = parseInt(text, 10);
										if (!isNaN(val) && val > 0 && onChangeSetting) {
											onChangeSetting(item.key, val);
										}
									}}
									onBlur={() => {
										const val = parseInt(localValues[item.key], 10);
										if (isNaN(val) || val <= 0) {
											setLocalValues((prev) => ({
												...prev,
												[item.key]: settings[item.key].toString()
											}));
										} else if (onChangeSetting) {
											onChangeSetting(item.key, val);
										}
									}}
									className="w-12 h-8 bg-transparent text-center text-[15px] font-medium text-[var(--color-text)] focus:outline-none border-b border-transparent focus:border-[var(--color-primary)]"
								/>
								<button
									className="h-8 w-8 rounded bg-[var(--color-bg)] shadow-sm flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-primary)] cursor-pointer"
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