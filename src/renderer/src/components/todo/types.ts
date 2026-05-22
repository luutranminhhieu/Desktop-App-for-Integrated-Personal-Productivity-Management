/* ── Status & Priority enums (mirroring preload/index.d.ts) ── */
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'canceled';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

/* ── TodoItem shape returned by API ── */
export interface TodoItem {
	_id: string;
	title: string;
	description?: string;
	status: TodoStatus;
	priority: TodoPriority;
	dueDate?: string;
	tags: string[];
	userId: string;
	project?: string;
	focusMinutes: number;
	focusDate?: string;
	completedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

/* ── Task stats returned by window.api.todo.stats ── */
export interface TaskStats {
	total: number;
	completed: number;
	pending: number;
	overdue: number;
	urgent: number;
	canceled: number;
	tasksThisMonth: number;
}

/* ── Filter options sent to the API ── */
export interface FilterOptions {
	status?: TodoStatus;
	priority?: TodoPriority;
	tags?: string[];
	query?: string;
	dueDateFrom?: string;
	dueDateTo?: string;
}

/* ── Form data used by TodoForm modal ── */
export interface TodoFormData {
	title: string;
	description?: string;
	priority: TodoPriority;
	dueDate?: string;
	tags: string[];
	project?: string;
}

/* ── Modal mode ── */
export type TodoModalMode = 'create' | 'edit';

/* ── Tab key for the Tasks page ── */
export type TabKey = 'daily' | 'monthly' | 'yearly';

/* ── Status filter key used in the sidebar ── */
export type StatusFilterKey = 'all' | 'pending' | 'completed' | 'canceled';