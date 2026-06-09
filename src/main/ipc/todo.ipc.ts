import { ipcMain } from 'electron';
import mongoose from 'mongoose';
import { todoService } from '../services/todo.service';
import { CreateTodoSchema, UpdateTodoSchema, toDateOrUndefined } from '../utils/validation';
import { logger } from '../utils/logger';
import { ITodo } from '../models/Todo';

function prepareDates(input: Record<string, unknown>): Record<string, unknown> {
	const dateFields = ['startDate', 'dueDate', 'focusDate', 'completedAt'];
	for (const field of dateFields) {
		if (input[field] === null) {
			input[field] = null;
		} else if (input[field] !== undefined) {
			input[field] = toDateOrUndefined(input[field]);
		}
	}
	return input;
}

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

function toIdString(value: unknown): string {
	if (typeof value === 'string') return value;
	if (value instanceof mongoose.Types.ObjectId) return value.toHexString();
	if (value && typeof value === 'object' && 'id' in value) {
		const raw = (value as { id: Uint8Array | Buffer }).id;
		return Buffer.from(raw).toString('hex');
	}
	return String(value);
}

export function registerTodoIPC(): void {
	ipcMain.handle('todo:create', async (_, payload) => {
		try {
			const parsed = CreateTodoSchema.parse(payload);
			const withDates = prepareDates({ ...parsed } as unknown as Record<string, unknown>);
			const validatedPayload = {
				...withDates,
				userId: new mongoose.Types.ObjectId(parsed.userId)
			} as unknown as Partial<ITodo>;
			const data = await todoService.createTodo(validatedPayload);
			return { success: true, data: serialize(data) };
		} catch (error) {
			logger.error('Error in todo:create', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:list', async (_, options) => {
		try {
			const data = await todoService.listTodos(options);
			return { success: true, data: serialize(data) };
		} catch (error) {
			logger.error('Error in todo:list', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:update', async (_, { todoId, updates, userId }) => {
		try {
			const safeTodoId = toIdString(todoId);
			const safeUserId = toIdString(userId);
			const validated = UpdateTodoSchema.parse({ todoId: safeTodoId, updates, userId: safeUserId });
			const preparedUpdates = prepareDates({ ...validated.updates } as unknown as Record<string, unknown>);
			const data = await todoService.updateTodo(validated.todoId, preparedUpdates as unknown as Partial<ITodo>, validated.userId);
			return { success: true, data: serialize(data) };
		} catch (error) {
			logger.error('Error in todo:update', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:delete', async (_, { todoId, userId }) => {
		try {
			const safeTodoId = toIdString(todoId);
			const safeUserId = toIdString(userId);
			await todoService.deleteTodo(safeTodoId, safeUserId);
			return { success: true };
		} catch (error) {
			logger.error('Error in todo:delete', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:stats', async (_, { userId }) => {
		try {
			const safeUserId = toIdString(userId);
			const data = await todoService.getTaskStats(safeUserId);
			return { success: true, data: serialize(data) };
		} catch (error) {
			logger.error('Error in todo:stats', error);
			return { success: false, error: (error as Error).message };
		}
	});
}

