import { ipcMain } from 'electron';
import mongoose from 'mongoose';
import { todoService } from '../services/todo.service';
import { CreateTodoSchema, UpdateTodoSchema } from '../utils/validation';
import { logger } from '../utils/logger';

export function registerTodoIPC(): void {
	ipcMain.handle('todo:create', async (_, payload) => {
		try {
			const parsed = CreateTodoSchema.parse(payload);
			const validatedPayload = {
				...parsed,
				userId: new mongoose.Types.ObjectId(parsed.userId)
			} as any;
			const data = await todoService.createTodo(validatedPayload);
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
			const data = await todoService.updateTodo(validated.todoId, validated.updates, validated.userId);
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
