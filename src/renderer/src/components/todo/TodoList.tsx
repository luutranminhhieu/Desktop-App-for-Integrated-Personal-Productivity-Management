import React from 'react';
import type { TodoItem as TodoItemType } from '@renderer/types';
import TodoItemComponent from './TodoItem';
import { TODO_CONFIG } from '@renderer/config/todoConfig';

export interface TodoListProps {
	title?: string;
	todos: TodoItemType[];
	onToggle: (todo: TodoItemType) => void;
	onEdit: (todo: TodoItemType) => void;
	onDelete: (todo: TodoItemType) => void;
	onDragStart: (e: React.DragEvent, todo: TodoItemType) => void;
	onDragEnd: () => void;
	onDragOverTask: (e: React.DragEvent, todo: TodoItemType) => void;
	onDropTask: (e: React.DragEvent, todo: TodoItemType) => void;
	draggingTodoId?: string | null;
	dragOverTodoId?: string | null;
	expandedTodos: Record<string, boolean>;
	onToggleExpand: (todoId: string, forceFocus: boolean) => void;
	onSubtaskToggle: (todo: TodoItemType, subtaskId: string) => void;
	onSubtaskDelete: (todo: TodoItemType, subtaskId: string) => void;
	onSubtaskCreate: (todo: TodoItemType, title: string) => void;
	onSubtaskEdit: (todo: TodoItemType, subtaskId: string, title: string) => void;
	focusTodoId: string | null;
	setFocusTodoId: (todoId: string | null) => void;
	emptyMessage?: string;
}

export const TodoList: React.FC<TodoListProps> = ({
	title,
	todos,
	onToggle,
	onEdit,
	onDelete,
	onDragStart,
	onDragEnd,
	onDragOverTask,
	onDropTask,
	draggingTodoId,
	dragOverTodoId,
	expandedTodos,
	onToggleExpand,
	onSubtaskToggle,
	onSubtaskDelete,
	onSubtaskCreate,
	onSubtaskEdit,
	focusTodoId,
	setFocusTodoId,
	emptyMessage = TODO_CONFIG.STRINGS.noTasksInGroup
}) => {
	return (
		<div className="space-y-4">
			{title && (
				<header className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
					<h2 className="text-lg font-semibold leading-tight text-[var(--color-text)]">
						{title}{' '}
						<span className="text-[var(--color-muted)] font-normal ml-2">
							— {todos.length} {TODO_CONFIG.STRINGS.tasksCount}
						</span>
					</h2>
				</header>
			)}

			{todos.length > 0 ? (
				<div className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] overflow-hidden">
					{todos.map((todo) => (
						<TodoItemComponent
							key={todo._id}
							todo={todo}
							onToggle={onToggle}
							onEdit={onEdit}
							onDelete={onDelete}
							onDragStart={onDragStart}
							onDragEnd={onDragEnd}
							onDragOver={onDragOverTask}
							onDrop={onDropTask}
							isDragging={draggingTodoId === todo._id}
							isDragOver={dragOverTodoId === todo._id}
							isExpanded={Boolean(expandedTodos[todo._id])}
							onToggleExpand={(forceFocus) => onToggleExpand(todo._id, forceFocus)}
							onSubtaskToggle={onSubtaskToggle}
							onSubtaskDelete={onSubtaskDelete}
							onSubtaskCreate={onSubtaskCreate}
							onSubtaskEdit={onSubtaskEdit}
							focusOnMount={focusTodoId === todo._id}
							setFocusOnMount={() => setFocusTodoId(null)}
						/>
					))}
				</div>
			) : (
				<div className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-8 text-center">
					<p className="text-sm text-[var(--color-muted)]">{emptyMessage}</p>
				</div>
			)}
		</div>
	);
};

export default TodoList;