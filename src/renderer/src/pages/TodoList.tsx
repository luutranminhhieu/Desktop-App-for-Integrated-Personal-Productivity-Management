import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TodoForm from '../components/todo/TodoForm';
import type {
	TodoItem,
	TodoFormData,
	TodoModalMode,
	TodoPriority,
	TodoStatus
} from '@renderer/types';

const filterOptions: {
	key: 'all' | TodoStatus;
	label: string;
	icon: string;
}[] = [
	{ key: 'all', label: 'Tất cả', icon: 'all_inbox' },
	{ key: 'pending', label: 'To-do', icon: 'schedule' },
	{ key: 'canceled', label: 'Cancel', icon: 'cancel' },
	{ key: 'completed', label: 'Done', icon: 'check_circle' }
];

function formatExpired(dueDate: string): string {
	const diff = Date.now() - new Date(dueDate).getTime();
	const hours = Math.floor(diff / 3600000);
	if (hours < 1) return 'Expired < 1h ago';
	if (hours < 24) return `Expired ${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `Expired ${days}d ago`;
}

function formatTime(dueDate: string): string {
	return new Date(dueDate).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

function formatDoneAt(completedAt: string): string {
	return `Done at ${new Date(completedAt).toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	})}`;
}

const PriorityBadge = ({ priority }: { priority: TodoPriority }): React.JSX.Element => {
	const styles: Record<TodoPriority, { bg: string; text: string; label: string }> = {
		urgent: { bg: 'var(--color-error-light)', text: 'var(--color-error)', label: 'URGENT' },
		high: { bg: 'var(--color-primary-light)', text: 'var(--color-primary)', label: 'HIGH' },
		medium: { bg: 'var(--color-surface)', text: 'var(--color-muted)', label: 'NORMAL' },
		low: { bg: 'var(--color-surface)', text: 'var(--color-muted)', label: 'LOW' }
	};
	const s = styles[priority];
	return (
		<span
			className="px-2 py-0.5 rounded text-[11px] font-semibold leading-none tracking-wide"
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

interface TaskRowProps {
	todo: TodoItem;
	onToggle: (todo: TodoItem) => void;
	onEdit: (todo: TodoItem) => void;
	onDragStart: (e: React.DragEvent, todo: TodoItem) => void;
	onDragEnd: () => void;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent, todo: TodoItem) => void;
}

const TaskRow = ({ todo, onToggle, onEdit, onDragStart, onDragEnd, onDragOver, onDrop }: TaskRowProps): React.JSX.Element => {
	const isDone = todo.status === 'completed';
	const isCanceled = todo.status === 'canceled';
	const isMuted = isDone || isCanceled;
	const isOverdue =
		!isDone &&
		!isCanceled &&
		todo.dueDate &&
		new Date(todo.dueDate) < new Date();

	const rowClasses = [
		'task-row flex items-center gap-4 px-4 py-3 border-b border-[var(--color-border)] transition-colors cursor-grab active:cursor-grabbing',
		isDone ? 'bg-[var(--color-primary-lighter)]' : '',
		isMuted ? 'opacity-60' : 'hover:bg-[var(--color-bg)]'
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div
			className={rowClasses}
			draggable="true"
			onDragStart={(e) => onDragStart(e, todo)}
			onDragEnd={onDragEnd}
			onDragOver={onDragOver}
			onDrop={(e) => onDrop(e, todo)}
		>
			<TaskCheckbox status={todo.status} onClick={() => onToggle(todo)} />

			<div className="flex-1 min-w-0">
				<p
					className={`text-sm leading-relaxed ${
						isMuted ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]'
					} ${isDone ? 'line-through' : ''}`}
				>
					{todo.title}
				</p>
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
							Skipped
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

			<button
				className="task-actions opacity-0 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-opacity p-1"
				onClick={() => onEdit(todo)}
				type="button"
			>
				<span className="material-symbols-outlined">more_horiz</span>
			</button>
		</div>
	);
};

interface TaskGroupProps {
	title?: string;
	todos: TodoItem[];
	showSort?: boolean;
	isSplit?: boolean;
	onToggleSplit?: () => void;
	onToggle: (todo: TodoItem) => void;
	onEdit: (todo: TodoItem) => void;
	onAddTask?: () => void;
	onDragStart: (e: React.DragEvent, todo: TodoItem) => void;
	onDragEnd: () => void;
	onDragOverTask: (e: React.DragEvent) => void;
	onDropTask: (e: React.DragEvent, todo: TodoItem) => void;
}

const TaskGroup = ({
	title,
	todos,
	onToggle,
	onEdit,
	onAddTask,
	onDragStart,
	onDragEnd,
	onDragOverTask,
	onDropTask
}: TaskGroupProps): React.JSX.Element => (
	<div className="space-y-4">
		{title && (
			<header className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
				<h2 className="text-lg font-semibold leading-tight text-[var(--color-text)]">
					{title}{' '}
					<span className="text-[var(--color-muted)] font-normal ml-2">
						— {todos.length} tasks
					</span>
				</h2>
			</header>
		)}

		{todos.length > 0 ? (
			<div className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] overflow-hidden">
				{todos.map((todo) => (
					<TaskRow
						key={todo._id}
						todo={todo}
						onToggle={onToggle}
						onEdit={onEdit}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
						onDragOver={onDragOverTask}
						onDrop={onDropTask}
					/>
				))}
			</div>
		) : (
			<div className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-8 text-center">
				<p className="text-sm text-[var(--color-muted)]">Không có task nào trong nhóm này</p>
			</div>
		)}

		{onAddTask && (
			<button
				className="w-full py-2 border-2 border-dashed border-[var(--color-border)] rounded-md text-[var(--color-primary)] text-[15px] font-medium leading-snug hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all flex items-center justify-center gap-2"
				onClick={onAddTask}
				type="button"
			>
				<span className="material-symbols-outlined">add</span>
				Thêm task
			</button>
		)}
	</div>
);


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

	/* ── Split Mode & Column Naming states ── */
	const [isSplit, setIsSplit] = useState<boolean>(() => localStorage.getItem('todo_is_split') === 'true');
	const [column1Name, setColumn1Name] = useState<string>(() => localStorage.getItem('todo_col1_name') || 'Column 1');
	const [column2Name, setColumn2Name] = useState<string>(() => localStorage.getItem('todo_col2_name') || 'Column 2');
	const [editingCol, setEditingCol] = useState<1 | 2 | null>(null);
	const [createColId, setCreateColId] = useState<number>(1);

	/* ── Drag & Drop states ── */
	const [draggingTodo, setDraggingTodo] = useState<TodoItem | null>(null);
	const [dragOverCol, setDragOverCol] = useState<1 | 2 | null>(null);

	/* ── Modal state ── */
	const [modalOpen, setModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<TodoModalMode>('create');
	const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

	/* Split is only allowed on 'all' and 'pending' filters */
	const canSplit = activeFilter === 'all' || activeFilter === 'pending';
	const effectiveSplit = isSplit && canSplit;

	const toggleSplit = (): void => {
		setIsSplit((prev) => {
			const next = !prev;
			localStorage.setItem('todo_is_split', String(next));
			return next;
		});
	};

	/* ── Drag & Drop Handlers ── */
	const handleDragStart = (e: React.DragEvent, todo: TodoItem): void => {
		setDraggingTodo(todo);
		e.dataTransfer.setData('text/plain', todo._id);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragEnd = (): void => {
		setDraggingTodo(null);
		setDragOverCol(null);
	};

	const handleDragOver = (e: React.DragEvent, colId: 1 | 2): void => {
		e.preventDefault();
		if (isSplit && dragOverCol !== colId) {
			setDragOverCol(colId);
		}
	};

	const handleDrop = async (e: React.DragEvent, targetColId: 1 | 2): Promise<void> => {
		e.preventDefault();
		setDragOverCol(null);
		if (!draggingTodo || !userId) return;

		const currentColId = draggingTodo.columnId ?? 1;
		if (currentColId !== targetColId) {
			// Optimistic UI update
			setTodos((prevTodos) =>
				prevTodos.map((todo) =>
					todo._id === draggingTodo._id ? { ...todo, columnId: targetColId } : todo
				)
			);

			try {
				const response = await window.api.todo.update(
					draggingTodo._id,
					{ columnId: targetColId },
					userId
				);
				if (!response.success) {
					await reloadData();
				}
			} catch {
				await reloadData();
			}
		}
	};

	const handleDragOverTask = (e: React.DragEvent): void => {
		e.preventDefault();
	};

	const handleDropTask = async (e: React.DragEvent, targetTodo: TodoItem): Promise<void> => {
		e.preventDefault();
		if (!draggingTodo || !userId || draggingTodo._id === targetTodo._id) return;

		const targetColId = targetTodo.columnId ?? 1;

		setTodos((prevTodos) => {
			const result = [...prevTodos];
			const draggedIndex = result.findIndex((t) => t._id === draggingTodo._id);
			const targetIndex = result.findIndex((t) => t._id === targetTodo._id);

			if (draggedIndex !== -1 && targetIndex !== -1) {
				const [removed] = result.splice(draggedIndex, 1);
				removed.columnId = targetColId;
				result.splice(targetIndex, 0, removed);
			}
			return result;
		});

		const currentColId = draggingTodo.columnId ?? 1;
		if (currentColId !== targetColId) {
			try {
				await window.api.todo.update(
					draggingTodo._id,
					{ columnId: targetColId },
					userId
				);
			} catch {
				await reloadData();
			}
		}
	};

	/* ── Fetch todos ── */
	const fetchTodos = useCallback(async (): Promise<void> => {
		if (!userId) return;
		setLoading(true);
		setError('');

		const options: Record<string, unknown> = { userId };

		if (activeFilter !== 'all') {
			options.status = activeFilter;
		}

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
				setError(response.error || 'Không thể tải danh sách task.');
				setLoading(false);
				return;
			}

			const items = response.data as TodoItem[];
			setTodos(items);
		} catch {
			setError('Không thể tải danh sách task.');
		} finally {
			setLoading(false);
		}
	}, [userId, activeFilter, dueDateFrom, dueDateTo]);

	/* ── Load data on mount & when filters change ── */
	useEffect(() => {
		if (!userId) {
			setLoading(false);
			setError('Thiếu thông tin người dùng.');
			return;
		}
		void fetchTodos();
	}, [userId, fetchTodos]);

	/* ── Filtered todos for columns ── */
	const col1Todos = useMemo(() => {
		return todos.filter((todo) => todo.columnId !== 2);
	}, [todos]);

	const col2Todos = useMemo(() => {
		return todos.filter((todo) => todo.columnId === 2);
	}, [todos]);

	/* ── Reload helper ── */
	const reloadData = useCallback(async (): Promise<void> => {
		await fetchTodos();
	}, [fetchTodos]);

	/* ── CRUD handlers ── */
	const handleCreate = async (data: TodoFormData): Promise<void> => {
		if (!userId) return;
		const payload: Record<string, unknown> = {
			title: data.title,
			description: data.description,
			priority: data.priority,
			columnId: createColId,
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
			setError(response.error || 'Không thể tạo task.');
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
			columnId: data.columnId ?? editingTodo.columnId ?? 1,
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
			setError(response.error || 'Không thể cập nhật task.');
			return;
		}
		setModalOpen(false);
		setEditingTodo(null);
		await reloadData();
	};

	const handleDelete = async (): Promise<void> => {
		if (!userId || !editingTodo) return;
		const confirmed = window.confirm('Bạn có chắc chắn muốn xóa task này?');
		if (!confirmed) return;

		const response = await window.api.todo.delete(editingTodo._id, userId);
		if (!response.success) {
			setError(response.error || 'Không thể xóa task.');
			return;
		}
		setModalOpen(false);
		setEditingTodo(null);
		await reloadData();
	};

	const handleToggleStatus = async (todo: TodoItem): Promise<void> => {
		if (!userId) return;
		const newStatus: TodoStatus =
			todo.status === 'completed' ? 'pending' : 'completed';
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
			setError(response.error || 'Không thể cập nhật trạng thái.');
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

	const openCreateModal = (colId: number = 1): void => {
		setCreateColId(colId);
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
		<div className="max-w-[1200px] mx-auto">

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
			<div className="flex flex-wrap justify-between items-center bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] shadow-sm gap-4 mb-6">
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
									? `${dueDateFrom ? new Date(dueDateFrom).toLocaleDateString('vi-VN') : '...'} - ${
											dueDateTo ? new Date(dueDateTo).toLocaleDateString('vi-VN') : '...'
									  }`
									: 'Khoảng ngày'}
							</span>
						</button>

						{isDateRangeOpen && (
							<div className="absolute top-full left-0 mt-2 z-50 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl p-4 w-72 space-y-4">
								<div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2 mb-2">
									<span className="text-sm font-semibold text-[var(--color-text)]">Chọn khoảng ngày</span>
								</div>
								<div className="space-y-3">
									<div className="space-y-1">
										<label className="text-xs font-medium text-[var(--color-muted)]">Từ ngày</label>
										<input
											type="date"
											value={tempDateFrom}
											onChange={(e) => setTempDateFrom(e.target.value)}
											className="w-full h-9 px-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
										/>
									</div>
									<div className="space-y-1">
										<label className="text-xs font-medium text-[var(--color-muted)]">Đến ngày</label>
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
										Xóa
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
										Áp dụng
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
									? 'Tất cả trạng thái'
									: activeFilter === 'pending'
									? 'To-do'
									: activeFilter === 'canceled'
									? 'Cancel'
									: 'Done'}
							</span>
						</button>

						{isStatusFilterOpen && (
							<div className="absolute top-full left-0 mt-2 z-50 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-xl py-1.5 w-52 overflow-hidden">
								{filterOptions.map((opt) => (
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

				<div className="flex items-center gap-3">
					{/* Split Screen Button — only on 'all' & 'pending' */}
					{canSplit && (
						<button
							className={`flex items-center justify-center h-10 w-10 rounded-md border transition-all ${
								isSplit
									? 'bg-[var(--color-primary-light)] border-[var(--color-primary)] text-[var(--color-primary)]'
									: 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
							}`}
							onClick={() => toggleSplit()}
							type="button"
							title={isSplit ? 'Gộp lại 1 cột' : 'Tách thành 2 cột'}
						>
							<span className="material-symbols-outlined text-[20px]">
								{isSplit ? 'splitscreen' : 'view_column'}
							</span>
						</button>
					)}

					{/* Create Task Button */}
					<button
						className="h-10 px-5 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition-colors rounded-md text-sm font-semibold flex items-center gap-2 shadow-sm"
						onClick={() => openCreateModal(1)}
						type="button"
					>
						<span className="material-symbols-outlined text-[18px]">add</span>
						Tạo task mới
					</button>
				</div>
			</div>

			{/* ═══ Main Content Panel ═══ */}
			<div className="space-y-6">

				{!loading && todos.length === 0 && !error && (
					<div className="bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-12 text-center">
						<span
							className="material-symbols-outlined text-[var(--color-border)] mb-4 block"
							style={{ fontSize: '64px' }}
						>
							task_alt
						</span>
						<h3 className="text-lg font-semibold text-[var(--color-muted)] mb-2">
							Không có task nào
						</h3>
						<p className="text-sm text-[var(--color-muted)] mb-6">
							{activeFilter !== 'all'
								? 'Thử thay đổi bộ lọc để thấy kết quả khác'
								: 'Bắt đầu bằng việc tạo task mới'}
						</p>
					</div>
				)}

				{!loading && todos.length > 0 && (
					<>
						{!effectiveSplit ? (
							/* ─── 1 Column Layout ─── */
							<section className="space-y-8">
								<TaskGroup
									todos={todos}
									onToggle={handleToggleStatus}
									onEdit={openEditModal}
									onAddTask={() => openCreateModal(1)}
									onDragStart={handleDragStart}
									onDragEnd={handleDragEnd}
									onDragOverTask={handleDragOverTask}
									onDropTask={handleDropTask}
								/>
							</section>
						) : (
							/* ─── 2 Column Layout ─── */
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
								{/* Column 1 */}
								<div
									className={`space-y-6 p-4 rounded-xl border transition-all overflow-y-auto max-h-[calc(100vh-130px)] ${
										dragOverCol === 1
											? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] bg-opacity-20'
											: 'border-[var(--color-border)] bg-[var(--color-bg)] bg-opacity-50'
									}`}
									onDragOver={(e) => handleDragOver(e, 1)}
									onDrop={(e) => handleDrop(e, 1)}
								>
									<header className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
										{editingCol === 1 ? (
											<input
												type="text"
												value={column1Name}
												onChange={(e) => setColumn1Name(e.target.value)}
												onBlur={() => {
													setEditingCol(null);
													localStorage.setItem('todo_col1_name', column1Name);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														setEditingCol(null);
														localStorage.setItem('todo_col1_name', column1Name);
													}
												}}
												className="text-base font-bold bg-[var(--color-bg)] border border-[var(--color-primary)] rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
												autoFocus
											/>
										) : (
											<div className="flex items-center gap-2 group">
												<h3 className="text-base font-bold text-[var(--color-text)]">{column1Name}</h3>
												<button
													onClick={() => setEditingCol(1)}
													className="opacity-0 group-hover:opacity-100 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-opacity"
												>
													<span className="material-symbols-outlined text-[16px]">edit</span>
												</button>
											</div>
										)}
									</header>

									<div className="space-y-8">
										{col1Todos.length > 0 ? (
											<TaskGroup
												todos={col1Todos}
												onToggle={handleToggleStatus}
												onEdit={openEditModal}
												onAddTask={() => openCreateModal(1)}
												onDragStart={handleDragStart}
												onDragEnd={handleDragEnd}
												onDragOverTask={handleDragOverTask}
												onDropTask={handleDropTask}
											/>
										) : (
											<div className="py-12 text-center text-sm text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-lg">
												Kéo thả task vào đây hoặc nhấn Thêm task
											</div>
										)}
									</div>
								</div>

								{/* Column 2 */}
								<div
									className={`space-y-6 p-4 rounded-xl border transition-all overflow-y-auto max-h-[calc(100vh-160px)] ${
										dragOverCol === 2
											? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] bg-opacity-20'
											: 'border-[var(--color-border)] bg-[var(--color-bg)] bg-opacity-50'
									}`}
									onDragOver={(e) => handleDragOver(e, 2)}
									onDrop={(e) => handleDrop(e, 2)}
								>
									<header className="flex justify-between items-center pb-2 border-b border-[var(--color-border)]">
										{editingCol === 2 ? (
											<input
												type="text"
												value={column2Name}
												onChange={(e) => setColumn2Name(e.target.value)}
												onBlur={() => {
													setEditingCol(null);
													localStorage.setItem('todo_col2_name', column2Name);
												}}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														setEditingCol(null);
														localStorage.setItem('todo_col2_name', column2Name);
													}
												}}
												className="text-base font-bold bg-[var(--color-bg)] border border-[var(--color-primary)] rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
												autoFocus
											/>
										) : (
											<div className="flex items-center gap-2 group">
												<h3 className="text-base font-bold text-[var(--color-text)]">{column2Name}</h3>
												<button
													onClick={() => setEditingCol(2)}
													className="opacity-0 group-hover:opacity-100 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-opacity"
												>
													<span className="material-symbols-outlined text-[16px]">edit</span>
												</button>
											</div>
										)}
									</header>

									<div className="space-y-8">
										{col2Todos.length > 0 ? (
											<TaskGroup
												todos={col2Todos}
												onToggle={handleToggleStatus}
												onEdit={openEditModal}
												onDragStart={handleDragStart}
												onDragEnd={handleDragEnd}
												onDragOverTask={handleDragOverTask}
												onDropTask={handleDropTask}
											/>
										) : (
											<div className="py-12 text-center text-sm text-[var(--color-muted)] border border-dashed border-[var(--color-border)] rounded-lg">
												Kéo thả task từ {column1Name} sang đây
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</>
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