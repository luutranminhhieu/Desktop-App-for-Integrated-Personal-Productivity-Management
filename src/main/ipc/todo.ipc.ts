import { ipcMain } from 'electron';
import mongoose from 'mongoose';
import { todoService } from '../services/todo.service';
import { CreateTodoSchema, UpdateTodoSchema, toDateOrUndefined } from '../utils/validation';
import { logger } from '../utils/logger';

function prepareDates(input: Record<string, unknown>): Record<string, unknown> {
	const dateFields = ['dueDate', 'focusDate', 'completedAt'];
	for (const field of dateFields) {
		if (input[field] === null) {
			input[field] = null;
		} else if (input[field] !== undefined) {
			input[field] = toDateOrUndefined(input[field]);
		}
	}
	return input;
}

export function registerTodoIPC(): void {
	ipcMain.handle('todo:create', async (_, payload) => {
		try {
			const parsed = CreateTodoSchema.parse(payload);
			const withDates = prepareDates({ ...parsed } as unknown as Record<string, unknown>);
			const validatedPayload = {
				...withDates,
				userId: new mongoose.Types.ObjectId(parsed.userId)
			} as any;
			const data = await todoService.createTodo(validatedPayload as any);
			return { success: true, data };
		} catch (error) {
			logger.error('Error in todo:create', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:list', async (_, options) => {
		try {
			const data = await todoService.listTodos(options);
			return { success: true, data };
		} catch (error) {
			logger.error('Error in todo:list', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:update', async (_, { todoId, updates, userId }) => {
		try {
			const validated = UpdateTodoSchema.parse({ todoId, updates, userId });
			const preparedUpdates = prepareDates({ ...validated.updates } as unknown as Record<string, unknown>);
			const data = await todoService.updateTodo(validated.todoId, preparedUpdates as any, validated.userId);
			return { success: true, data };
		} catch (error) {
			logger.error('Error in todo:update', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:delete', async (_, { todoId, userId }) => {
		try {
			await todoService.deleteTodo(todoId, userId);
			return { success: true };
		} catch (error) {
			logger.error('Error in todo:delete', error);
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:stats', async (_, { userId }) => {
		try {
			const data = await todoService.getTaskStats(userId);
			return { success: true, data };
		} catch (error) {
			logger.error('Error in todo:stats', error);
			return { success: false, error: (error as Error).message };
		}
	});
}
