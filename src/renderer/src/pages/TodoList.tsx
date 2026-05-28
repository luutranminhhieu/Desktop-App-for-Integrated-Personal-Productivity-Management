import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TodoForm from '../components/todo/TodoForm';
import type {
	TodoItem,
	TodoFormData,
	TodoModalMode,
	TaskStats,
	TabKey,
	StatusFilterKey,
	TodoPriority,
	TodoStatus
} from '@renderer/types';

/* ════════════════════════════════════════════════════════════ */
/*  Constants                                                  */
/* ════════════════════════════════════════════════════════════ */

const tabs: { key: TabKey; label: string }[] = [
	{ key: 'daily', label: 'Daily/Weekly' },
	{ key: 'monthly', label: 'Monthly Goals' },
	{ key: 'yearly', label: 'Yearly Goals' }
];

const filterButtons: {
	key: StatusFilterKey;
	label: string;
	icon: string;
	statsKey: keyof TaskStats;
}[] = [
	{ key: 'all', label: 'Tất cả', icon: 'all_inbox', statsKey: 'total' },
	{ key: 'pending', label: 'Đang làm', icon: 'pending', statsKey: 'pending' },
	{ key: 'completed', label: 'Hoàn thành', icon: 'check_circle', statsKey: 'completed' },
	{ key: 'canceled', label: 'Bị bỏ qua', icon: 'block', statsKey: 'canceled' }
];

const categories: { label: string; color: string }[] = [
	{ label: 'Cá nhân', color: '#7C3AED' },
	{ label: 'Công việc', color: '#4F3CC9' },
	{ label: 'Học tập', color: '#F59E0B' }
];

/* ════════════════════════════════════════════════════════════ */
/*  Helpers                                                    */
/* ════════════════════════════════════════════════════════════ */

function startOfDay(d: Date): Date {
	const r = new Date(d);
	r.setHours(0, 0, 0, 0);
	return r;
}

function endOfDay(d: Date): Date {
	const r = new Date(d);
	r.setHours(23, 59, 59, 999);
	return r;
}

function getTimeframeRange(
	tf: string
): { from: string; to: string } | null {
	const now = new Date();
	if (tf === 'today') {
		return {
			from: startOfDay(now).toISOString(),
			to: endOfDay(now).toISOString()
		};
	}
	if (tf === 'this_week') {
		const dayOfWeek = now.getDay();
		const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		const monday = new Date(now);
		monday.setDate(now.getDate() + mondayOffset);
		const sunday = new Date(monday);
		sunday.setDate(monday.getDate() + 6);
		return {
			from: startOfDay(monday).toISOString(),
			to: endOfDay(sunday).toISOString()
		};
	}
	if (tf === 'this_month') {
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		return {
			from: startOfDay(monthStart).toISOString(),
			to: endOfDay(monthEnd).toISOString()
		};
	}
	return null; // 'all' — no date constraint
}

/** Returns a date-bucket label for grouping */
function getDateGroup(dueDate: string | undefined, now: Date): string {
	if (!dueDate) return 'Không có hạn';
	const d = new Date(dueDate);
	const today = startOfDay(now);
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);
	const dayAfter = new Date(today);
	dayAfter.setDate(today.getDate() + 2);

	if (d < today) return 'Quá hạn';
	if (d < tomorrow) return 'Hôm nay';
	if (d < dayAfter) return 'Ngày mai';
	return 'Sắp tới';
}

const GROUP_ORDER: Record<string, number> = {
	'Quá hạn': 0,
	'Hôm nay': 1,
	'Ngày mai': 2,
	'Sắp tới': 3,
	'Không có hạn': 4
};

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

/* ════════════════════════════════════════════════════════════ */
/*  Sub-components                                             */
/* ════════════════════════════════════════════════════════════ */

const PriorityBadge = ({ priority }: { priority: TodoPriority }): React.JSX.Element => {
	const styles: Record<TodoPriority, { bg: string; text: string; label: string }> = {
		urgent: { bg: '#ffdad6', text: '#EF4444', label: 'URGENT' },
		high: { bg: '#EDE9FF', text: '#4F3CC9', label: 'HIGH' },
		medium: { bg: '#ebe6f2', text: '#6B7280', label: 'NORMAL' },
		low: { bg: '#ebe6f2', text: '#6B7280', label: 'LOW' }
	};
	const s = styles[priority];
	return (
		<span
			className="px-[8px] py-[2px] rounded text-[11px] font-semibold leading-none tracking-[0.02em]"
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
				className="w-[16px] h-[16px] bg-[#10B981] flex items-center justify-center rounded-full text-white shrink-0 cursor-pointer hover:bg-[#059669] transition-colors"
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
			<div className="w-[16px] h-[16px] border-2 border-[#E5E7EB] flex items-center justify-center rounded-full text-[#6B7280] shrink-0">
				<span
					className="block"
					style={{ width: '8px', height: '2px', backgroundColor: '#6B7280' }}
				/>
			</div>
		);
	}
	return (
		<button
			onClick={onClick}
			className="w-[16px] h-[16px] border-2 border-[#E5E7EB] rounded-full cursor-pointer hover:border-[#4F3CC9] transition-colors shrink-0"
			type="button"
		/>
	);
};

interface TaskRowProps {
	todo: TodoItem;
	onToggle: (todo: TodoItem) => void;
	onEdit: (todo: TodoItem) => void;
}

const TaskRow = ({ todo, onToggle, onEdit }: TaskRowProps): React.JSX.Element => {
	const isDone = todo.status === 'completed';
	const isCanceled = todo.status === 'canceled';
	const isMuted = isDone || isCanceled;
	const isOverdue =
		!isDone &&
		!isCanceled &&
		todo.dueDate &&
		new Date(todo.dueDate) < new Date();

	const rowClasses = [
		'task-row flex items-center gap-[16px] px-[16px] py-[12px] border-b border-[#E5E7EB] transition-colors',
		isDone ? 'bg-[#f6f2fe]' : '',
		isMuted ? 'opacity-60' : 'hover:bg-white'
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={rowClasses}>
			<TaskCheckbox status={todo.status} onClick={() => onToggle(todo)} />

			<div className="flex-1 min-w-0">
				<p
					className={`text-[14px] leading-[1.5] ${
						isMuted ? 'text-[#6B7280]' : 'text-[#1A1A2E]'
					} ${isDone ? 'line-through' : ''}`}
				>
					{todo.title}
				</p>
				<div className="flex items-center gap-[16px] mt-[4px] flex-wrap">
					{/* Priority badge (only for active tasks) */}
					{!isDone && !isCanceled && <PriorityBadge priority={todo.priority} />}

					{/* Expired indicator */}
					{isOverdue && todo.dueDate && (
						<span className="flex items-center gap-[4px] text-[#EF4444] text-[12px] font-medium leading-[1.4]">
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
						<span className="text-[#6B7280] text-[12px] font-medium leading-[1.4]">
							{formatTime(todo.dueDate)}
						</span>
					)}

					{/* Done timestamp */}
					{isDone && todo.completedAt && (
						<span className="text-[#6B7280] text-[12px] font-medium leading-[1.4]">
							{formatDoneAt(todo.completedAt)}
						</span>
					)}

					{/* Canceled label */}
					{isCanceled && (
						<span className="text-[#6B7280] text-[12px] font-medium leading-[1.4] italic">
							Skipped
						</span>
					)}

					{/* Tags (compact) */}
					{todo.tags.length > 0 && (
						<div className="flex gap-[4px]">
							{todo.tags.slice(0, 2).map((tag) => (
								<span
									key={tag}
									className="px-[6px] py-[1px] text-[10px] bg-[#F6F2FE] text-[#4F3CC9] rounded"
								>
									#{tag}
								</span>
							))}
							{todo.tags.length > 2 && (
								<span className="px-[6px] py-[1px] text-[10px] bg-[#F6F2FE] text-[#4F3CC9] rounded">
									+{todo.tags.length - 2}
								</span>
							)}
						</div>
					)}
				</div>
			</div>

			<button
				className="task-actions opacity-0 text-[#6B7280] hover:text-[#4F3CC9] transition-opacity p-[4px]"
				onClick={() => onEdit(todo)}
				type="button"
			>
				<span className="material-symbols-outlined">more_horiz</span>
			</button>
		</div>
	);
};

interface TaskGroupProps {
	title: string;
	count: number;
	todos: TodoItem[];
	showSort?: boolean;
	onToggle: (todo: TodoItem) => void;
	onEdit: (todo: TodoItem) => void;
	onAddTask: () => void;
}

const TaskGroup = ({
	title,
	count,
	todos,
	showSort = false,
	onToggle,
	onEdit,
	onAddTask
}: TaskGroupProps): React.JSX.Element => (
	<div className="space-y-[16px]">
		<header className="flex items-center justify-between border-b border-[#E5E7EB] pb-[8px]">
			<h2 className="text-[18px] font-semibold leading-[1.3] text-[#1A1A2E]">
				{title}{' '}
				<span className="text-[#6B7280] font-normal ml-[8px]">
					— {count} tasks
				</span>
			</h2>
			{showSort && (
				<button className="text-[#6B7280] hover:text-[#4F3CC9] transition-colors" type="button">
					<span className="material-symbols-outlined">sort</span>
				</button>
			)}
		</header>

		{todos.length > 0 ? (
			<div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
				{todos.map((todo) => (
					<TaskRow key={todo._id} todo={todo} onToggle={onToggle} onEdit={onEdit} />
				))}
			</div>
		) : (
			<div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
				<p className="text-[14px] text-[#6B7280]">Không có task nào trong nhóm này</p>
			</div>
		)}

		<button
			className="w-full py-[8px] border-2 border-dashed border-[#E5E7EB] rounded-lg text-[#4F3CC9] text-[15px] font-medium leading-[1.4] hover:border-[#4F3CC9] hover:bg-[#EDE9FF] transition-all flex items-center justify-center gap-[8px]"
			onClick={onAddTask}
			type="button"
		>
			<span className="material-symbols-outlined">add</span>
			Thêm task
		</button>
	</div>
);

/* ════════════════════════════════════════════════════════════ */
/*  Stats Section (replaces Goal Cards)                        */
/* ════════════════════════════════════════════════════════════ */

const StatsSection = ({ stats }: { stats: TaskStats }): React.JSX.Element => {
	const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
	const pendingRate = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

	return (
		<div className="mt-[48px]">
			<h3 className="text-[18px] font-semibold leading-[1.3] text-[#1A1A2E] mb-[16px]">
				Tổng quan tháng này
			</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
				{/* Completion card */}
				<div className="bg-white p-[24px] rounded-xl border border-[#E5E7EB] shadow-sm space-y-[16px]">
					<div className="flex justify-between items-start">
						<div>
							<span className="px-[8px] py-[2px] rounded text-[11px] font-semibold leading-none tracking-[0.02em] bg-[#EDE9FF] text-[#4F3CC9]">
								HOÀN THÀNH
							</span>
							<h4 className="text-[15px] font-medium leading-[1.4] text-[#1A1A2E] mt-[8px]">
								Tỷ lệ hoàn thành
							</h4>
						</div>
						<span className="text-[18px] font-bold leading-[1.3] text-[#4F3CC9]">
							{completionRate}%
						</span>
					</div>
					<div className="space-y-[8px]">
						<div className="w-full bg-[#f6f2fe] h-[8px] rounded-full overflow-hidden">
							<div
								className="h-full rounded-full transition-all duration-500 bg-[#4F3CC9]"
								style={{ width: `${completionRate}%` }}
							/>
						</div>
						<div className="flex justify-between text-[12px] font-medium leading-[1.4] text-[#6B7280]">
							<span>{stats.completed}/{stats.total} tasks</span>
							<span>{stats.tasksThisMonth} tháng này</span>
						</div>
					</div>
				</div>

				{/* Pending card */}
				<div className="bg-white p-[24px] rounded-xl border border-[#E5E7EB] shadow-sm space-y-[16px]">
					<div className="flex justify-between items-start">
						<div>
							<span className="px-[8px] py-[2px] rounded text-[11px] font-semibold leading-none tracking-[0.02em] bg-[#FEF3C7] text-[#D97706]">
								CẦN LÀM
							</span>
							<h4 className="text-[15px] font-medium leading-[1.4] text-[#1A1A2E] mt-[8px]">
								Task đang chờ
							</h4>
						</div>
						<span className="text-[18px] font-bold leading-[1.3] text-[#D97706]">
							{pendingRate}%
						</span>
					</div>
					<div className="space-y-[8px]">
						<div className="w-full bg-[#FEF3C7] h-[8px] rounded-full overflow-hidden">
							<div
								className="h-full rounded-full transition-all duration-500 bg-[#F59E0B]"
								style={{ width: `${pendingRate}%` }}
							/>
						</div>
						<div className="flex justify-between text-[12px] font-medium leading-[1.4] text-[#6B7280]">
							<span>{stats.pending} pending · {stats.overdue} quá hạn</span>
							<span>{stats.urgent} khẩn cấp</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/* ════════════════════════════════════════════════════════════ */
/*  Main TodoList Page                                         */
/* ════════════════════════════════════════════════════════════ */

const TodoList = (): React.JSX.Element => {
	/* ── Auth ── */
	const [userId] = useState<string | null>(() => {
		const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (!stored) return null;
		try {
			const parsed = JSON.parse(stored) as { id?: string };
			return parsed.id ?? null;
		} catch {
			return null;
		}
	});

	/* ── Data state ── */
	const [todos, setTodos] = useState<TodoItem[]>([]);
	const [stats, setStats] = useState<TaskStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	/* ── UI state ── */
	const [activeTab, setActiveTab] = useState<TabKey>('daily');
	const [activeFilter, setActiveFilter] = useState<StatusFilterKey>('all');
	const [timeframe, setTimeframe] = useState('all');

	/* ── Modal state ── */
	const [modalOpen, setModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<TodoModalMode>('create');
	const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

	/* ── Fetch todos ── */
	const fetchTodos = useCallback(async (): Promise<void> => {
		if (!userId) return;
		setLoading(true);
		setError('');

		const options: Record<string, unknown> = { userId };

		// Status filter
		if (activeFilter !== 'all') {
			if (activeFilter === 'pending') {
				// "Đang làm" includes both pending and in_progress
				// Backend supports single status, so we fetch all and filter client-side
			} else {
				options.status = activeFilter;
			}
		}

		// Timeframe → date range
		const range = getTimeframeRange(timeframe);
		if (range) {
			options.dueDateFrom = range.from;
			options.dueDateTo = range.to;
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

			let items = response.data as TodoItem[];

			// Client-side filter for "pending" (includes in_progress)
			if (activeFilter === 'pending') {
				items = items.filter(
					(t) => t.status === 'pending' || t.status === 'in_progress'
				);
			}

			setTodos(items);
		} catch {
			setError('Không thể tải danh sách task.');
		} finally {
			setLoading(false);
		}
	}, [userId, activeFilter, timeframe]);

	/* ── Fetch stats ── */
	const fetchStats = useCallback(async (): Promise<void> => {
		if (!userId) return;
		try {
			const response = await window.api.todo.stats(userId);
			if (response.success && response.data) {
				setStats(response.data as TaskStats);
			}
		} catch {
			// Stats failure is non-critical
		}
	}, [userId]);

	/* ── Load data on mount & when filters change ── */
	useEffect(() => {
		if (!userId) {
			setLoading(false);
			setError('Thiếu thông tin người dùng.');
			return;
		}
		void fetchTodos();
		void fetchStats();
	}, [userId, fetchTodos, fetchStats]);

	/* ── Group todos by date ── */
	const groupedTodos = useMemo(() => {
		const now = new Date();
		const groups = new Map<string, TodoItem[]>();

		for (const todo of todos) {
			const group = getDateGroup(todo.dueDate, now);
			if (!groups.has(group)) groups.set(group, []);
			groups.get(group)!.push(todo);
		}

		// Sort groups by predefined order
		return Array.from(groups.entries()).sort(
			([a], [b]) => (GROUP_ORDER[a] ?? 99) - (GROUP_ORDER[b] ?? 99)
		);
	}, [todos]);

	/* ── Reload helper ── */
	const reloadData = useCallback(async (): Promise<void> => {
		await Promise.all([fetchTodos(), fetchStats()]);
	}, [fetchTodos, fetchStats]);

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
			project: data.project,
			tags: data.tags
		};
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

	/* ════════════════════════════════════════════════════════ */
	/*  Render                                                  */
	/* ════════════════════════════════════════════════════════ */

	return (
		<div className="max-w-[1200px] mx-auto">
			{/* ═══ Tab System ═══ */}
			<div className="flex items-center gap-[32px] mb-[24px] border-b border-[#E5E7EB]">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`pb-[12px] border-b-2 text-[15px] font-medium leading-[1.4] transition-colors ${
							activeTab === tab.key
								? 'border-[#4F3CC9] text-[#1A1A2E]'
								: 'border-transparent text-[#6B7280] hover:text-[#1A1A2E]'
						}`}
						onClick={() => setActiveTab(tab.key)}
						type="button"
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* ═══ Error bar ═══ */}
			{error && (
				<div className="mb-[16px] px-[16px] py-[12px] text-[12px] text-[#EF4444] border border-[#FECACA] bg-[#FEF2F2] rounded-lg flex items-center justify-between">
					<span>{error}</span>
					<button
						className="text-[#EF4444] hover:text-[#DC2626] ml-4"
						onClick={() => setError('')}
						type="button"
					>
						<span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
							close
						</span>
					</button>
				</div>
			)}

			{/* ═══ Two-column layout ═══ */}
			<div className="flex flex-col lg:flex-row gap-[24px]">
				{/* ─── Left Panel: Filters (280px) ─── */}
				<aside className="w-full lg:w-[280px] shrink-0 space-y-[32px]">
					{/* Timeframe dropdown */}
					<div className="space-y-[8px]">
						<label className="text-[12px] font-medium leading-[1.4] text-[#6B7280] uppercase tracking-wider">
							Timeframe
						</label>
						<div className="relative">
							<select
								className="w-full h-[44px] px-[16px] bg-white border border-[#E5E7EB] rounded-lg appearance-none text-[14px] leading-[1.5] focus:border-[#4F3CC9] outline-none cursor-pointer"
								value={timeframe}
								onChange={(e) => setTimeframe(e.target.value)}
							>
								<option value="all">Tất cả</option>
								<option value="today">Hôm nay</option>
								<option value="this_week">Tuần này</option>
								<option value="this_month">Tháng này</option>
							</select>
							<span className="material-symbols-outlined absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
								expand_more
							</span>
						</div>
					</div>

					{/* Status filter buttons */}
					<nav className="space-y-[8px]">
						<label className="text-[12px] font-medium leading-[1.4] text-[#6B7280] uppercase tracking-wider">
							Filters
						</label>
						<div className="space-y-[4px]">
							{filterButtons.map((item) => {
								const isActive = item.key === activeFilter;
								const count = stats ? stats[item.statsKey] : 0;
								return (
									<button
										key={item.key}
										className={`w-full flex items-center justify-between px-[16px] py-[8px] rounded-lg text-[15px] font-medium leading-[1.4] transition-colors ${
											isActive
												? 'bg-[#EDE9FF] text-[#4F3CC9]'
												: 'text-[#6B7280] hover:bg-[#f6f2fe]'
										}`}
										onClick={() => setActiveFilter(item.key)}
										type="button"
									>
										<div className="flex items-center gap-[12px]">
											<span className="material-symbols-outlined">
												{item.icon}
											</span>
											{item.label}
										</div>
										<span className="text-[12px] font-medium leading-[1.4]">
											{count}
										</span>
									</button>
								);
							})}
						</div>
					</nav>

					{/* Categories */}
					<nav className="space-y-[8px]">
						<label className="text-[12px] font-medium leading-[1.4] text-[#6B7280] uppercase tracking-wider">
							Categories
						</label>
						<div className="space-y-[4px]">
							{categories.map((cat) => (
								<button
									key={cat.label}
									className="w-full flex items-center gap-[12px] px-[16px] py-[8px] rounded-lg text-[#6B7280] hover:bg-[#f6f2fe] transition-colors text-[15px] font-medium leading-[1.4]"
									type="button"
								>
									<div
										className="w-[8px] h-[8px] rounded-full shrink-0"
										style={{ backgroundColor: cat.color }}
									/>
									{cat.label}
								</button>
							))}
						</div>
					</nav>
				</aside>

				{/* ─── Right Panel: Task List ─── */}
				<section className="flex-1 space-y-[32px]">
					{/* Loading state */}
					{loading && (
						<div className="flex items-center justify-center py-16">
							<div className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 shadow-sm">
								<span className="h-4 w-4 rounded-full border-2 border-[#4F3CC9] border-t-transparent animate-spin" />
								<span className="text-[12px] text-[#6B7280]">
									Đang tải danh sách task...
								</span>
							</div>
						</div>
					)}

					{/* Empty state */}
					{!loading && todos.length === 0 && !error && (
						<div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
							<span
								className="material-symbols-outlined text-[#E5E7EB] mb-4 block"
								style={{ fontSize: '64px' }}
							>
								task_alt
							</span>
							<h3 className="text-[18px] font-semibold text-[#6B7280] mb-2">
								Không có task nào
							</h3>
							<p className="text-[14px] text-[#9CA3AF] mb-6">
								{activeFilter !== 'all'
									? 'Thử thay đổi bộ lọc để thấy kết quả khác'
									: 'Bắt đầu bằng việc tạo task mới'}
							</p>
							<button
								className="px-6 py-2 bg-[#4F3CC9] text-white rounded-lg hover:bg-[#3A2D9E] transition-colors text-[14px] font-medium"
								onClick={openCreateModal}
								type="button"
							>
								<span className="material-symbols-outlined mr-1" style={{ fontSize: '18px', verticalAlign: 'middle' }}>
									add
								</span>
								Tạo task mới
							</button>
						</div>
					)}

					{/* Task groups */}
					{!loading &&
						groupedTodos.map(([group, items], index) => (
							<TaskGroup
								key={group}
								title={group}
								count={items.length}
								todos={items}
								showSort={index === 0}
								onToggle={handleToggleStatus}
								onEdit={openEditModal}
								onAddTask={openCreateModal}
							/>
						))}

					{/* Stats section (replaces Goal Cards) */}
					{!loading && stats && <StatsSection stats={stats} />}
				</section>
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