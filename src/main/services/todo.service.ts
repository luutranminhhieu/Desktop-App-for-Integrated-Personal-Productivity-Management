import mongoose from 'mongoose';
import { ITodo, Todo, TodoPriority, TodoStatus } from '../models/Todo';

type ListTodoOptions = {
	userId: string;
	status?: TodoStatus;
	priority?: TodoPriority;
	tags?: string[];
	query?: string;
	dueDateFrom?: Date;
	dueDateTo?: Date;
	limit?: number;
};

export type TaskStats = {
	total: number;
	completed: number;
	pending: number;
	overdue: number;
	urgent: number;
	canceled: number;
	tasksThisMonth: number;
};

export type PomodoroStats = {
	completed: number;
	target: number;
};

export type FocusDay = {
	date: string;
	hours: number;
};

export type HeatmapData = {
	startDate: string;
	values: number[];
};

const DEFAULT_LIST_LIMIT = 200;

function startOfDay(value: Date): Date {
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date;
}

function endOfDay(value: Date): Date {
	const date = new Date(value);
	date.setHours(23, 59, 59, 999);
	return date;
}

function formatDateKey(value: Date): string {
	return value.toISOString().slice(0, 10);
}

export class TodoService {
	public async createTodo(payload: Partial<ITodo>): Promise<ITodo> {
		if (!payload.title) {
			throw new Error('Title is required.');
		}
		if (!payload.userId) {
			throw new Error('User is required.');
		}

		const todo = await Todo.create(payload);
		return todo;
	}

	public async listTodos(options: ListTodoOptions): Promise<ITodo[]> {
		const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(options.userId) };

		if (options.status) {
			filter.status = options.status;
		}
		if (options.priority) {
			filter.priority = options.priority;
		}
		if (options.tags && options.tags.length > 0) {
			filter.tags = { $in: options.tags };
		}
		if (options.query) {
			const regex = new RegExp(options.query, 'i');
			filter.$or = [{ title: regex }, { description: regex }, { project: regex }];
		}
		const dueDateFrom = options.dueDateFrom ? new Date(options.dueDateFrom) : undefined;
		const dueDateTo = options.dueDateTo ? new Date(options.dueDateTo) : undefined;

		if (dueDateFrom || dueDateTo) {
			filter.dueDate = {};
			if (dueDateFrom) {
				(filter.dueDate as Record<string, unknown>).$gte = dueDateFrom;
			}
			if (dueDateTo) {
				(filter.dueDate as Record<string, unknown>).$lte = dueDateTo;
			}
		}

		return Todo.find(filter)
			.sort({ dueDate: 1, createdAt: -1 })
			.limit(options.limit ?? DEFAULT_LIST_LIMIT);
	}

	public async updateTodo(todoId: string, updates: Partial<ITodo>, userId: string): Promise<ITodo> {
		const todo = await Todo.findOneAndUpdate(
			{ _id: todoId, userId: new mongoose.Types.ObjectId(userId) },
			updates,
			{ new: true }
		);

		if (!todo) {
			throw new Error('Todo not found.');
		}

		return todo;
	}

	public async deleteTodo(todoId: string, userId: string): Promise<void> {
		const result = await Todo.findOneAndDelete({ _id: todoId, userId: new mongoose.Types.ObjectId(userId) });
		if (!result) {
			throw new Error('Todo not found.');
		}
	}

	public async getTodayTasks(userId: string): Promise<ITodo[]> {
		const now = new Date();
		return Todo.find({
			userId: new mongoose.Types.ObjectId(userId),
			dueDate: { $gte: startOfDay(now), $lte: endOfDay(now) }
		}).sort({ dueDate: 1 });
	}

	public async getUrgentTasks(userId: string): Promise<ITodo[]> {
		return Todo.find({
			userId: new mongoose.Types.ObjectId(userId),
			priority: { $in: ['urgent', 'high'] },
			status: { $nin: ['completed', 'canceled'] }
		}).sort({ dueDate: 1 });
	}

	public async getTaskStats(userId: string): Promise<TaskStats> {
		const uid = new mongoose.Types.ObjectId(userId);
		const now = new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

		const [total, completed, pending, urgent, overdue, canceled, tasksThisMonth] = await Promise.all([
			Todo.countDocuments({ userId: uid }),
			Todo.countDocuments({ userId: uid, status: 'completed' }),
			Todo.countDocuments({ userId: uid, status: { $in: ['pending', 'in_progress'] } }),
			Todo.countDocuments({ userId: uid, priority: { $in: ['urgent', 'high'] } }),
			Todo.countDocuments({
				userId: uid,
				status: { $nin: ['completed', 'canceled'] },
				dueDate: { $lt: now }
			}),
			Todo.countDocuments({ userId: uid, status: 'canceled' }),
			Todo.countDocuments({ userId: uid, createdAt: { $gte: monthStart, $lte: monthEnd } })
		]);

		return { total, completed, pending, overdue, urgent, canceled, tasksThisMonth };
	}

	public async getPomodoroStatsToday(userId: string, target = 10): Promise<PomodoroStats> {
		const uid = new mongoose.Types.ObjectId(userId);
		const now = new Date();
		const start = startOfDay(now);
		const end = endOfDay(now);

		const rows = await Todo.aggregate<{ totalMinutes: number }>([
			{ $match: { userId: uid, focusMinutes: { $gt: 0 } } },
			{
				$addFields: {
					focusDay: { $ifNull: ['$focusDate', '$updatedAt'] }
				}
			},
			{ $match: { focusDay: { $gte: start, $lte: end } } },
			{ $group: { _id: null, totalMinutes: { $sum: '$focusMinutes' } } }
		]);

		const totalMinutes = rows[0]?.totalMinutes ?? 0;
		const completed = Math.floor(totalMinutes / 25);
		return { completed, target };
	}

	public async getFocusHours(userId: string, days = 7): Promise<FocusDay[]> {
		const uid = new mongoose.Types.ObjectId(userId);
		const now = new Date();
		const startDate = startOfDay(new Date(now.getTime() - (days - 1) * 86400000));

		const rows = await Todo.aggregate<{ _id: string; date: string; totalMinutes: number }>([
			{ $match: { userId: uid, focusMinutes: { $gt: 0 } } },
			{
				$addFields: {
					focusDay: { $ifNull: ['$focusDate', '$updatedAt'] }
				}
			},
			{ $match: { focusDay: { $gte: startDate, $lte: endOfDay(now) } } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$focusDay' } },
					totalMinutes: { $sum: '$focusMinutes' }
				}
			}
		]);

		const totals = new Map(rows.map((row) => [row._id, row.totalMinutes]));
		const result: FocusDay[] = [];
		for (let offset = 0; offset < days; offset += 1) {
			const day = new Date(startDate.getTime() + offset * 86400000);
			const key = formatDateKey(day);
			const minutes = totals.get(key) ?? 0;
			result.push({ date: key, hours: Math.round((minutes / 60) * 10) / 10 });
		}

		return result;
	}

	public async getFocusStreak(userId: string, lookbackDays = 60): Promise<number> {
		const uid = new mongoose.Types.ObjectId(userId);
		const now = new Date();
		const startDate = startOfDay(new Date(now.getTime() - (lookbackDays - 1) * 86400000));

		const rows = await Todo.aggregate<{ _id: string; date: string; totalMinutes: number }>([
			{ $match: { userId: uid, focusMinutes: { $gt: 0 } } },
			{
				$addFields: {
					focusDay: { $ifNull: ['$focusDate', '$updatedAt'] }
				}
			},
			{ $match: { focusDay: { $gte: startDate, $lte: endOfDay(now) } } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$focusDay' } },
					totalMinutes: { $sum: '$focusMinutes' }
				}
			}
		]);

		const focusDays = new Set(rows.filter((row) => row.totalMinutes > 0).map((row) => row._id));
		let streak = 0;
		for (let offset = 0; offset < lookbackDays; offset += 1) {
			const day = new Date(now.getTime() - offset * 86400000);
			const key = formatDateKey(day);
			if (!focusDays.has(key)) {
				break;
			}
			streak += 1;
		}

		return streak;
	}

	public async getFocusHoursTotal(userId: string, days = 365): Promise<number> {
		const uid = new mongoose.Types.ObjectId(userId);
		const now = new Date();
		const startDate = startOfDay(new Date(now.getTime() - (days - 1) * 86400000));

		const rows = await Todo.aggregate<{ totalMinutes: number }>([
			{ $match: { userId: uid, focusMinutes: { $gt: 0 } } },
			{
				$addFields: {
					focusDay: { $ifNull: ['$focusDate', '$updatedAt'] }
				}
			},
			{ $match: { focusDay: { $gte: startDate, $lte: endOfDay(now) } } },
			{ $group: { _id: null, totalMinutes: { $sum: '$focusMinutes' } } }
		]);

		const totalMinutes = rows[0]?.totalMinutes ?? 0;
		return Math.round((totalMinutes / 60) * 10) / 10;
	}

	public async getActivityHeatmap(userId: string, weeks = 12): Promise<HeatmapData> {
		const totalDays = weeks * 7;
		const now = new Date();
		const startDate = startOfDay(new Date(now.getTime() - (totalDays - 1) * 86400000));
		const uid = new mongoose.Types.ObjectId(userId);

		const rows = await Todo.aggregate<{ _id: string; date: string; count: number }>([
			{ $match: { userId: uid, createdAt: { $gte: startDate, $lte: endOfDay(now) } } },
			{
				$group: {
					_id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
					count: { $sum: 1 }
				}
			}
		]);

		const counts = new Map(rows.map((row) => [row._id, row.count]));
		const values: number[] = [];

		for (let offset = 0; offset < totalDays; offset += 1) {
			const day = new Date(startDate.getTime() + offset * 86400000);
			const key = formatDateKey(day);
			const count = counts.get(key) ?? 0;
			const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
			values.push(level);
		}

		return { startDate: formatDateKey(startDate), values };
	}
}

export const todoService = new TodoService();
