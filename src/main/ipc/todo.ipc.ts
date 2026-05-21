import { ipcMain } from 'electron';
import { todoService } from '../services/todo.service';

export function registerTodoIPC(): void {
	ipcMain.handle('todo:create', async (_, payload) => {
		try {
			const data = await todoService.createTodo(payload);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:list', async (_, options) => {
		try {
			const data = await todoService.listTodos(options);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:update', async (_, { todoId, updates, userId }) => {
		try {
			const data = await todoService.updateTodo(todoId, updates, userId);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:delete', async (_, { todoId, userId }) => {
		try {
			await todoService.deleteTodo(todoId, userId);
			return { success: true };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('todo:stats', async (_, { userId }) => {
		try {
			const data = await todoService.getTaskStats(userId);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});
}
