import React from 'react';

const TodoList = (): React.JSX.Element => {
	return (
		<div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
			<h1 className="text-[18px] font-semibold text-[#1A1A2E]">Tasks</h1>
			<p className="text-[14px] text-[#6B7280]">Danh sách công việc đang được hoàn thiện.</p>
		</div>
	);
};

export default TodoList;
