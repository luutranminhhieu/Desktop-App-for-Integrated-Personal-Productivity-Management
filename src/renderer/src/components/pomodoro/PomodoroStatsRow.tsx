import React from 'react';

const stats = [
	{ icon: 'timer', label: 'Phiên tập trung', value: '8 / 12' },
	{ icon: 'bolt', label: 'Tổng thời gian', value: '3h 20m' },
	{ icon: 'bedtime', label: 'Thời gian nghỉ', value: '40m' }
];

const PomodoroStatsRow = (): React.JSX.Element => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
			{stats.map((item) => (
				<div
					key={item.label}
					className="bg-white p-6 rounded-xl border border-[#E5E7EB] flex items-center gap-4"
				>
					<div className="h-12 w-12 rounded-lg bg-[#EDE9FF] flex items-center justify-center text-[#4F3CC9]">
						<span className="material-symbols-outlined">{item.icon}</span>
					</div>
					<div>
						<p className="text-[12px] font-medium text-[#6B7280]">{item.label}</p>
						<h2 className="text-[18px] font-semibold text-[#1A1A2E]">{item.value}</h2>
					</div>
				</div>
			))}
		</div>
	);
};

export default PomodoroStatsRow;
