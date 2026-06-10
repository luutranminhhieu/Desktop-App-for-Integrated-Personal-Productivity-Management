import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TodoForm from '../components/todo/TodoForm';
import TodoListComponent from '../components/todo/TodoList';
import { TODO_CONFIG } from '@renderer/config/todoConfig';
import type {
	TodoItem,
	TodoFormData,
	TodoModalMode,
	TodoStatus,
	SubTodo
} from '@renderer/types';

/* ════════════════════════════════════════════════════════════ */
/*  Main TodoList Page                                         */
/* ════════════════════════════════════════════════════════════ */

const TodoList = (): React.JSX.Element => {
	/* ── Auth ── */
	const [userId] = useState<string | null>(() => {
		const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (!stored) return null;
		try {
			const parsed = JSON.parse(stored) as { id?: string; _id?: string };
			return parsed.id ?? parsed._id ?? null;
		} catch {
			return null;
		}
	});

	/* ── Data state ── */
	const [todos, setTodos] = useState<TodoItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [expandedTodos, setExpandedTodos] = useState<Record<string, boolean>>({});
	const [focusTodoId, setFocusTodoId] = useState<string | null>(null);

	/* ── UI state ── */
	const [activeFilter, setActiveFilter] = useState<'all' | TodoStatus>('all');
	const [dueDateFrom, setDueDateFrom] = useState<string | null>(null);
	const [dueDateTo, setDueDateTo] = useState<string | null>(null);

	// Temp date states for popup fields
	const [tempDateFrom, setTempDateFrom] = useState<string>('');
	const [tempDateTo, setTempDateTo] = useState<string>('');

	// Popover states
	const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
	const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);

	/* ── Modal state ── */
	const [modalOpen, setModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<TodoModalMode>('create');
	const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

	/* ── Drag & Drop states ── */
	const [draggingTodo, setDraggingTodo] = useState<TodoItem | null>(null);
	const [dragOverTodoId, setDragOverTodoId] = useState<string | null>(null);

	/* ── Client-side filtering ── */
	const filteredTodos = useMemo(() => {
		return todos.filter((todo) => {
			const isOverdue =
				todo.status === 'todo' &&
				todo.dueDate &&
				new Date(todo.dueDate) < new Date();

			switch (activeFilter) {
				case 'all':
					return true;
				case 'todo':
					return todo.status === 'todo' && !isOverdue;
				case 'completed':
					return todo.status === 'completed';
				case 'canceled':
					return todo.status === 'canceled' || isOverdue;
				default:
					return true;
			}
		});
	}, [todos, activeFilter]);

	/* ── Fetch todos (always fetch ALL, filter client-side) ── */
	const fetchTodos = useCallback(async (): Promise<void> => {
		if (!userId) return;
		setLoading(true);
		setError('');

		const options: Record<string, unknown> = { userId };

		if (dueDateFrom) {
			options.dueDateFrom = new Date(dueDateFrom).toISOString();
		}
		if (dueDateTo) {
			options.dueDateTo = new Date(dueDateTo).toISOString();
		}

		try {
			const response = await window.api.todo.list(
				options as Parameters<typeof window.api.todo.list>[0]
			);
			if (!response.success || !response.data) {
				setError(response.error || TODO_CONFIG.STRINGS.fetchError);
				setLoading(false);
				return;
			}

			const items = response.data as TodoItem[];
			setTodos(items);
		} catch {
			setError(TODO_CONFIG.STRINGS.fetchError);
		} finally {
			setLoading(false);
		}
	}, [userId, dueDateFrom, dueDateTo]);

	/* ── Load data on mount & when filters change ── */
	useEffect(() => {
		let active = true;
		const load = async (): Promise<void> => {
			await Promise.resolve();
			if (!active) return;

			if (!userId) {
				setLoading(false);
				setError(TODO_CONFIG.STRINGS.userRequiredError);
				return;
			}
			await fetchTodos();
		};
		load().catch(() => undefined);
		return () => {
			active = false;
		};
	}, [userId, fetchTodos]);

	/* ── Reload helper ── */
	const reloadData = useCallback(async (): Promise<void> => {
		await fetchTodos();
	}, [fetchTodos]);

	/* ── Subtask Handlers ── */
	const handleToggleExpand = (todoId: string, forceFocus: boolean): void => {
		setExpandedTodos((prev) => {
			const nextVal = !prev[todoId];
			if (nextVal && forceFocus) {
				setFocusTodoId(todoId);
			}
			return { ...prev, [todoId]: nextVal };
		});
	};

	const handleSubtaskToggle = async (todo: TodoItem, subtaskId: string): Promise<void> => {
		if (!userId) return;
		const updatedSubtasks = (todo.subtasks || []).map((sub) => {
			if (sub._id === subtaskId) {
				const newStatus = sub.status === 'completed' ? 'todo' : 'completed';
				return {
					...sub,
					status: newStatus,
					completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
				} as SubTodo;
			}
			return sub;
		});

		const response = await window.api.todo.update(
			todo._id,
			{ subtasks: updatedSubtasks },
			userId
		);
		if (!response.success) {
			setError(response.error || 'Failed to update subtask status');
			return;
		}
		await reloadData();
	};

	const handleSubtaskDelete = async (todo: TodoItem, subtaskId: string): Promise<void> => {
		if (!userId) return;
		const updatedSubtasks = (todo.subtasks || []).filter((sub) => sub._id !== subtaskId);

		const response = await window.api.todo.update(
			todo._id,
			{ subtasks: updatedSubtasks },
			userId
		);
		if (!response.success) {
			setError(response.error || 'Failed to delete subtask');
			return;
		}
		await reloadData();
	};

	const handleSubtaskCreate = async (todo: TodoItem, title: string): Promise<void> => {
		if (!userId) return;
		const newSubtask: SubTodo = {
			_id: window.crypto.randomUUID(),
			title,
			status: 'todo'
		};
		const updatedSubtasks = [...(todo.subtasks || []), newSubtask];

		const response = await window.api.todo.update(
			todo._id,
			{ subtasks: updatedSubtasks },
			userId
		);
		if (!response.success) {
			setError(response.error || 'Failed to create subtask');
			return;
		}
		setExpandedTodos((prev) => ({ ...prev, [todo._id]: true }));
		await reloadData();
	};

	const handleSubtaskEdit = async (todo: TodoItem, subtaskId: string, title: string): Promise<void> => {
		if (!userId) return;
		const updatedSubtasks = (todo.subtasks || []).map((sub) => {
			if (sub._id === subtaskId) {
				return { ...sub, title } as SubTodo;
			}
			return sub;
		});

		const response = await window.api.todo.update(
			todo._id,
			{ subtasks: updatedSubtasks },
			userId
		);
		if (!response.success) {
			setError(response.error || 'Failed to edit subtask');
			return;
		}
		await reloadData();
	};

	/* ── Drag & Drop Handlers ── */
	const handleDragStart = (e: React.DragEvent, todo: TodoItem): void => {
		setDraggingTodo(todo);
		e.dataTransfer.setData('text/plain', todo._id);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragEnd = (): void => {
		setDraggingTodo(null);
		setDragOverTodoId(null);
	};

	const handleDragOverTask = (e: React.DragEvent, todo: TodoItem): void => {
		e.preventDefault();
		if (draggingTodo && draggingTodo._id !== todo._id && dragOverTodoId !== todo._id) {
			setDragOverTodoId(todo._id);
		}
	};

	const handleDropTask = (e: React.DragEvent, targetTodo: TodoItem): void => {
		e.preventDefault();
		e.stopPropagation();
		setDragOverTodoId(null);
		if (!draggingTodo || draggingTodo._id === targetTodo._id) return;

		setTodos((prevTodos) => {
			const result = [...prevTodos];
			const draggedIndex = result.findIndex((t) => t._id === draggingTodo._id);
			const targetIndex = result.findIndex((t) => t._id === targetTodo._id);

			if (draggedIndex !== -1 && targetIndex !== -1) {
				const [removed] = result.splice(draggedIndex, 1);
				result.splice(targetIndex, 0, removed);
			}
			return result;
		});
	};

	/* ── CRUD handlers ── */
	const handleCreate = async (data: TodoFormData): Promise<void> => {
		if (!userId) return;
		const payload: Record<string, unknown> = {
			title: data.title,
			description: data.description,
			priority: data.priority,
			project: data.project,
			tags: data.tags,
			userId
		};
		if (data.startDate) {
			payload.startDate = new Date(data.startDate).toISOString();
		}
		if (data.dueDate) {
			payload.dueDate = new Date(data.dueDate).toISOString();
		}

		const response = await window.api.todo.create(
			payload as Parameters<typeof window.api.todo.create>[0]
		);
		if (!response.success) {
			setError(response.error || TODO_CONFIG.STRINGS.createError);
			return;
		}
		setModalOpen(false);
		setEditingTodo(null);
		await reloadData();
	};

	const handleUpdate = async (data: TodoFormData): Promise<void> => {
		if (!userId || !editingTodo) return;
		const updates: Record<string, unknown> = {
			title: data.title,
			description: data.description,
			priority: data.priority,
			project: data.project,
			tags: data.tags
		};
		if (data.startDate) {
			updates.startDate = new Date(data.startDate).toISOString();
		} else {
			updates.startDate = null;
		}
		if (data.dueDate) {
			updates.dueDate = new Date(data.dueDate).toISOString();
		} else {
			updates.dueDate = null;
		}

		const response = await window.api.todo.update(
			editingTodo._id,
			updates as Parameters<typeof window.api.todo.update>[1],
			userId
		);
		if (!response.success) {
			setError(response.error || TODO_CONFIG.STRINGS.updateError);
			return;
		}
		setModalOpen(false);
		setEditingTodo(null);
		await reloadData();
	};

	const handleDelete = async (): Promise<void> => {
		if (!userId || !editingTodo) return;

		const response = await window.api.todo.delete(editingTodo._id, userId);
		if (!response.success) {
			setError(response.error || TODO_CONFIG.STRINGS.deleteError);
			return;
		}
		setModalOpen(false);
		setEditingTodo(null);
		await reloadData();
	};

	const handleQuickDelete = async (todo: TodoItem): Promise<void> => {
		if (!userId) return;

		const response = await window.api.todo.delete(todo._id, userId);
		if (!response.success) {
			setError(response.error || TODO_CONFIG.STRINGS.deleteError);
			return;
		}
		await reloadData();
	};

	const handleToggleStatus = async (todo: TodoItem): Promise<void> => {
		if (!userId) return;
		const newStatus: TodoStatus =
			todo.status === 'completed' ? 'todo' : 'completed';
		const updates: Record<string, unknown> = { status: newStatus };
		if (newStatus === 'completed') {
			updates.completedAt = new Date().toISOString();
		} else {
			updates.completedAt = null;
		}

		const response = await window.api.todo.update(
			todo._id,
			updates as Parameters<typeof window.api.todo.update>[1],
			userId
		);
		if (!response.success) {
			setError(response.error || TODO_CONFIG.STRINGS.updateStatusError);
			return;
		}
		await reloadData();
	};

	const handleSubmit = async (data: TodoFormData): Promise<void> => {
		if (modalMode === 'create') {
			await handleCreate(data);
		} else {
			await handleUpdate(data);
		}
	};

	const openCreateModal = (): void => {
		setEditingTodo(null);
		setModalMode('create');
		setModalOpen(true);
	};

	const openEditModal = (todo: TodoItem): void => {
		setEditingTodo(todo);
		setModalMode('edit');
		setModalOpen(true);
	};

	return (
		<div className="max-w-[1200px] mx-auto h-[calc(100vh-60px)] flex flex-col overflow-hidden">

			{/* ═══ Error bar ═══ */}
			{error && (
				<div className="mb-4 px-4 py-3 text-xs text-[var(--color-error)] border border-[var(--color-error-border)] bg-[var(--color-error-light)] rounded-md flex items-center justify-between">
					<span>{error}</span>
					<button
						className="text-[var(--color-error)] hover:opacity-80 ml-4"
						onClick={() => setError('')}
						type="button"
					>
						<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
							close
						</span>
					</button>
				</div>
			)}

			{/* ═══ Action Toolbar ═══ */}
			<div className="flex flex-wrap justify-between items-center bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm gap-4 mb-6 shrink-0">
				<div className="flex items-center gap-3">
					{/* Date Range Selector Button & Popover */}
					<div className="relative">
						<button
							className={`flex items-center gap-2 h-10 px-4 rounded-md border text-sm font-medium transition-all ${
								dueDateFrom || dueDateTo
									? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
									: 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
							}`}
							onClick={() => {
								setIsDateRangeOpen(!isDateRangeOpen);
								setIsStatusFilterOpen(false);
								// Sync temp inputs with actual values
								setTempDateFrom(dueDateFrom || '');
								setTempDateTo(dueDateTo || '');
							}}
							type="button"
						>
							<span className="material-symbols-outlined text-[18px]">calendar_today</span>
							<span>
								{dueDateFrom || dueDateTo
									? `${dueDateFrom ? new Date(dueDateFrom).toLocaleDateString(TODO_CONFIG.LOCALE) : '...'} - ${
											dueDateTo ? new Date(dueDateTo).toLocaleDateString(TODO_CONFIG.LOCALE) : '...'
									  }`
									: TODO_CONFIG.STRINGS.dateRange}
							</span>
						</button>

						{isDateRangeOpen && (
							<div className="absolute top-full left-0 mt-2 z-50 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl p-4 w-72 space-y-4">
								<div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2 mb-2">
									<span className="text-sm font-semibold text-[var(--color-text)]">{TODO_CONFIG.STRINGS.selectDateRange}</span>
								</div>
								<div className="space-y-3">
									<div className="space-y-1">
										<label className="text-xs font-medium text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.fromDate}</label>
										<input
											type="date"
											value={tempDateFrom}
											onChange={(e) => setTempDateFrom(e.target.value)}
											className="w-full h-9 px-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-xs font-medium text-[var(--color-muted)]">{TODO_CONFIG.STRINGS.toDate}</label>
										<input
											type="date"
											value={tempDateTo}
											onChange={(e) => setTempDateTo(e.target.value)}
											className="w-full h-9 px-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
										/>
									</div>
								</div>
								<div className="flex gap-2 justify-end pt-2 border-t border-[var(--color-border)]">
									<button
										className="px-3 py-1.5 text-xs font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] rounded border border-[var(--color-border)] hover:bg-[var(--color-primary-lighter)] transition-colors"
										onClick={() => {
											setTempDateFrom('');
											setTempDateTo('');
											setDueDateFrom(null);
											setDueDateTo(null);
											setIsDateRangeOpen(false);
										}}
										type="button"
									>
										{TODO_CONFIG.STRINGS.clear}
									</button>
									<button
										className="px-3 py-1.5 text-xs font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded transition-colors"
										onClick={() => {
											setDueDateFrom(tempDateFrom || null);
											setDueDateTo(tempDateTo || null);
											setIsDateRangeOpen(false);
										}}
										type="button"
									>
										{TODO_CONFIG.STRINGS.apply}
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Status Filter Button & Popover */}
					<div className="relative">
						<button
							className={`flex items-center gap-2 h-10 px-4 rounded-md border text-sm font-medium transition-all ${
								activeFilter !== 'all'
									? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
									: 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
							}`}
							onClick={() => {
								setIsStatusFilterOpen(!isStatusFilterOpen);
								setIsDateRangeOpen(false);
							}}
							type="button"
						>
							<span className="material-symbols-outlined text-[18px]">filter_alt</span>
							<span>
								{activeFilter === 'all'
									? TODO_CONFIG.STRINGS.allStatuses
									: activeFilter === 'todo'
									? TODO_CONFIG.STRINGS.todo
									: activeFilter === 'canceled'
									? TODO_CONFIG.STRINGS.cancel
									: TODO_CONFIG.STRINGS.done}
							</span>
						</button>

						{isStatusFilterOpen && (
							<div className="absolute top-full left-0 mt-2 z-50 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl py-1.5 w-52 overflow-hidden">
								{TODO_CONFIG.FILTER_OPTIONS.map((opt) => (
									<button
										key={opt.key}
										className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors text-left ${
											activeFilter === opt.key
												? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold'
												: 'text-[var(--color-text)] hover:bg-[var(--color-primary-lighter)]'
										}`}
										onClick={() => {
											setActiveFilter(opt.key);
											setIsStatusFilterOpen(false);
										}}
										type="button"
									>
										<div className="flex items-center gap-2">
											<span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
											<span>{opt.label}</span>
										</div>
										{activeFilter === opt.key && (
											<span className="material-symbols-outlined text-[18px]">check</span>
										)}
									</button>
								))}
							</div>
						)}
					</div>
				</div>

				{(activeFilter === 'all' || activeFilter === 'todo') && (
					<div className="flex items-center gap-3 animate-fade-in">
						{/* Create Task Button */}
						<button
							className="h-10 px-5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors rounded-md text-sm font-semibold flex items-center gap-2 shadow-sm"
							onClick={openCreateModal}
							type="button"
						>
							<span className="material-symbols-outlined text-[18px]">add</span>
							{TODO_CONFIG.STRINGS.createNewTask}
						</button>
					</div>
				)}
			</div>

			{/* ═══ Main Content Panel ═══ */}
			<div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-6 pb-6">

				{!loading && filteredTodos.length === 0 && !error && (
					<div className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-12 text-center">
						<span
							className="material-symbols-outlined text-[var(--color-border)] mb-4 block"
							style={{ fontSize: '64px' }}
						>
							task_alt
						</span>
						<h3 className="text-lg font-semibold text-[var(--color-muted)] mb-2">
							{TODO_CONFIG.STRINGS.noTasks}
						</h3>
						<p className="text-sm text-[var(--color-muted)] mb-6">
							{activeFilter !== 'all'
								? TODO_CONFIG.STRINGS.tryChangingFilters
								: TODO_CONFIG.STRINGS.startByCreatingNew}
						</p>
					</div>
				)}

				{!loading && filteredTodos.length > 0 && (
					<section className="space-y-8">
						<TodoListComponent
							todos={filteredTodos}
							onToggle={handleToggleStatus}
							onEdit={openEditModal}
							onDelete={handleQuickDelete}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							onDragOverTask={handleDragOverTask}
							onDropTask={handleDropTask}
							draggingTodoId={draggingTodo?._id}
							dragOverTodoId={dragOverTodoId}
							expandedTodos={expandedTodos}
							onToggleExpand={handleToggleExpand}
							onSubtaskToggle={handleSubtaskToggle}
							onSubtaskDelete={handleSubtaskDelete}
							onSubtaskCreate={handleSubtaskCreate}
							onSubtaskEdit={handleSubtaskEdit}
							focusTodoId={focusTodoId}
							setFocusTodoId={setFocusTodoId}
						/>
					</section>
				)}
			</div>

			{/* ═══ Modal ═══ */}
			<TodoForm
				open={modalOpen}
				mode={modalMode}
				todo={editingTodo}
				onClose={() => {
					setModalOpen(false);
					setEditingTodo(null);
				}}
				onSubmit={handleSubmit}
				onDelete={modalMode === 'edit' ? handleDelete : undefined}
			/>
		</div>
	);
};

export default TodoList;
