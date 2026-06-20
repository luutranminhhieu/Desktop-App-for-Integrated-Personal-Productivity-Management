import React from 'react';
import type { TodoItem as TodoItemType, TodoStatus, TodoPriority } from '@renderer/types';
import { TODO_CONFIG } from '@renderer/config/todoConfig';
import { SubtaskRow, NewSubtaskForm } from './Subtask';

export interface TodoItemProps {
	todo: TodoItemType;
	onToggle: (todo: TodoItemType) => void;
	onEdit: (todo: TodoItemType) => void;
	onDelete: (todo: TodoItemType) => void;
	onDragStart: (e: React.DragEvent, todo: TodoItemType) => void;
	onDragEnd: () => void;
	onDragOver: (e: React.DragEvent, todo: TodoItemType) => void;
	onDrop: (e: React.DragEvent, todo: TodoItemType) => void;
	isDragging?: boolean;
	isDragOver?: boolean;
	isExpanded: boolean;
	onToggleExpand: (forceFocus: boolean) => void;
	onSubtaskToggle: (todo: TodoItemType, subtaskId: string) => void;
	onSubtaskDelete: (todo: TodoItemType, subtaskId: string) => void;
	onSubtaskCreate: (todo: TodoItemType, title: string) => void;
	onSubtaskEdit: (todo: TodoItemType, subtaskId: string, title: string) => void;
	focusOnMount: boolean;
	setFocusOnMount: () => void;
}

const PriorityBadge = ({ priority }: { priority: TodoPriority }): React.JSX.Element => {
	const s = TODO_CONFIG.PRIORITY_BADGES[priority];
	return (
		<span
			className="px-2 py-0.5 rounded text-[11px] font-semibold leading-none tracking-wide shrink-0"
			style={{ backgroundColor: s.bg, color: s.text }}
		>
			{s.label}
		</span>
	);
};

const TaskCheckbox = ({
	status,
	onClick
}: {
	status: TodoStatus;
	onClick: () => void;
}): React.JSX.Element => {
	if (status === 'completed') {
		return (
			<button
				onClick={onClick}
				className="w-4 h-4 bg-[var(--color-success)] flex items-center justify-center rounded-full text-white shrink-0 cursor-pointer hover:opacity-80 transition-colors"
				type="button"
			>
				<span className="material-symbols-outlined font-bold" style={{ fontSize: '12px' }}>
					check
				</span>
			</button>
		);
	}
	if (status === 'canceled') {
		return (
			<div className="w-4 h-4 border-2 border-[var(--color-border)] flex items-center justify-center rounded-full text-[var(--color-muted)] shrink-0">
				<span
					className="block"
					style={{ width: '8px', height: '2px', backgroundColor: 'var(--color-muted)' }}
				/>
			</div>
		);
	}
	return (
		<button
			onClick={onClick}
			className="w-4 h-4 border-2 border-[var(--color-border)] rounded-full cursor-pointer hover:border-[var(--color-primary)] transition-colors shrink-0"
			type="button"
		/>
	);
};

function formatExpired(dueDate: string): string {
	const diff = Date.now() - new Date(dueDate).getTime();
	const hours = Math.floor(diff / 3600000);
	if (hours < 1) return TODO_CONFIG.FORMATS.expiredLessAnHourAgo;
	if (hours < 24) return TODO_CONFIG.FORMATS.expiredHoursAgo(hours);
	const days = Math.floor(hours / 24);
	return TODO_CONFIG.FORMATS.expiredDaysAgo(days);
}

function formatTime(dueDate: string): string {
	return new Date(dueDate).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

function formatDoneAt(completedAt: string): string {
	const timeStr = new Date(completedAt).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
	return TODO_CONFIG.FORMATS.doneAt(timeStr);
}

export const TodoItem: React.FC<TodoItemProps> = ({
	todo,
	onToggle,
	onEdit,
	onDelete,
	onDragStart,
	onDragEnd,
	onDragOver,
	onDrop,
	isDragging = false,
	isDragOver = false,
	isExpanded = false,
	onToggleExpand,
	onSubtaskToggle,
	onSubtaskDelete,
	onSubtaskCreate,
	onSubtaskEdit,
	focusOnMount,
	setFocusOnMount
}) => {
	const isDone = todo.status === 'completed';
	const isCanceled = todo.status === 'canceled';
	const isMuted = isDone || isCanceled;
	const isOverdue =
		!isDone &&
		!isCanceled &&
		todo.dueDate &&
		new Date(todo.dueDate) < new Date();

	const rowClasses = [
		'task-row flex items-center gap-4 px-4 py-3 transition-all cursor-grab active:cursor-grabbing select-none',
		isDone ? 'bg-[var(--color-primary-lighter)]' : '',
		isMuted ? 'opacity-60' : 'hover:bg-[var(--color-bg)]',
		isDragging ? 'opacity-30 border-dashed border-[var(--color-primary)] bg-[var(--color-primary-lighter)]' : '',
		isDragOver ? 'border-t-2 border-t-[var(--color-primary)] bg-[var(--color-primary-light)] bg-opacity-10' : ''
	]
		.filter(Boolean)
		.join(' ');

	const completedSubtasks = (todo.subtasks || []).filter(sub => sub.status === 'completed').length;
	const totalSubtasks = (todo.subtasks || []).length;

	return (
		<div className="border-b border-[var(--color-border)] last:border-b-0">
			<div
				className={rowClasses}
				draggable="true"
				onDragStart={(e) => onDragStart(e, todo)}
				onDragEnd={onDragEnd}
				onDragOver={(e) => onDragOver(e, todo)}
				onDrop={(e) => onDrop(e, todo)}
			>
				{/* Dropdown button / Plus icon */}
				<div className="flex items-center gap-1.5 shrink-0 select-none">
					<button
						onClick={(e) => {
							e.stopPropagation();
							onToggleExpand(!(todo.subtasks && todo.subtasks.length > 0));
						}}
						className="w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--color-primary-lighter)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
						type="button"
					>
						<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
							{todo.subtasks && todo.subtasks.length > 0
								? isExpanded
									? 'keyboard_arrow_down'
									: 'keyboard_arrow_right'
								: 'add'}
						</span>
					</button>
					{todo.subtasks && todo.subtasks.length > 0 && (
						<span className="text-[10px] text-[var(--color-primary)] font-semibold shrink-0 bg-[var(--color-primary-lighter)] px-1 py-0.5 rounded leading-none select-none">
							{completedSubtasks}/{totalSubtasks}
						</span>
					)}
				</div>

				<TaskCheckbox status={todo.status} onClick={() => onToggle(todo)} />

				<div className="flex-1 min-w-0">
					<div className="flex items-baseline gap-2 min-w-0">
						<span
							className={`text-sm font-medium leading-relaxed truncate shrink-0 max-w-[60%] ${
								isMuted ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]'
							} ${isDone ? 'line-through' : ''}`}
						>
							{todo.title}
						</span>
						{todo.description && (
							<span
								className={`text-xs truncate text-[var(--color-muted)] flex-grow flex-shrink min-w-0 ${
									isMuted ? 'opacity-70' : ''
								}`}
								title={todo.description}
							>
								— {todo.description}
							</span>
						)}
					</div>
					<div className="flex items-center gap-4 mt-1 flex-wrap">
						{/* Priority badge (only for active tasks) */}
						{!isDone && !isCanceled && <PriorityBadge priority={todo.priority} />}

						{/* Expired indicator */}
						{isOverdue && todo.dueDate && (
							<span className="flex items-center gap-1 text-[var(--color-error)] text-xs font-medium leading-snug">
								<span
									className="material-symbols-outlined"
									style={{ fontSize: '14px' }}
								>
									event
								</span>

								{formatExpired(todo.dueDate)}
							</span>
						)}

						{/* Time for non-overdue active tasks */}
						{!isOverdue && !isDone && !isCanceled && todo.dueDate && (
							<span className="text-[var(--color-muted)] text-xs font-medium leading-snug">
								{formatTime(todo.dueDate)}
							</span>
						)}

						{/* Done timestamp */}
						{isDone && todo.completedAt && (
							<span className="text-[var(--color-muted)] text-xs font-medium leading-snug">
								{formatDoneAt(todo.completedAt)}
							</span>
						)}

						{/* Canceled label */}
						{isCanceled && (
							<span className="text-[var(--color-muted)] text-xs font-medium leading-snug italic">
								{TODO_CONFIG.STRINGS.skipped}
							</span>
						)}

						{/* Tags (compact) */}
						{todo.tags.length > 0 && (
							<div className="flex gap-1">
								{todo.tags.slice(0, 2).map((tag) => (
									<span
										key={tag}
										className="px-1.5 py-px text-[10px] bg-[var(--color-primary-lighter)] text-[var(--color-primary)] rounded"
									>
										#{tag}
									</span>
								))}
								{todo.tags.length > 2 && (
									<span className="px-1.5 py-px text-[10px] bg-[var(--color-primary-lighter)] text-[var(--color-primary)] rounded">
										+{todo.tags.length - 2}
									</span>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="flex items-center gap-1">
					<button
						className="task-actions opacity-0 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-opacity p-1 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onEdit(todo);
						}}
						type="button"
					>
						<span className="material-symbols-outlined">more_horiz</span>
					</button>
					<button
						className="task-actions opacity-0 text-[var(--color-muted)] hover:text-[var(--color-error)] transition-opacity p-1 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onDelete(todo);
						}}
						type="button"
						title="Xóa nhanh"
					>
						<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
					</button>
				</div>
			</div>

			{/* Expanded Subtask List */}
			{isExpanded && (
				<div className="bg-[var(--color-surface)] pl-12 pr-4 py-3 border-t border-[var(--color-border)] border-dashed space-y-1">
					{todo.subtasks && todo.subtasks.map((sub) => (
						<SubtaskRow
							key={sub._id}
							todo={todo}
							sub={sub}
							onToggle={onSubtaskToggle}
							onDelete={onSubtaskDelete}
							onEdit={onSubtaskEdit}
						/>
					))}
					<NewSubtaskForm
						todo={todo}
						onCreate={onSubtaskCreate}
						focusOnMount={focusOnMount}
						setFocusOnMount={setFocusOnMount}
					/>
				</div>
			)}
		</div>
	);
};

export default TodoItem;