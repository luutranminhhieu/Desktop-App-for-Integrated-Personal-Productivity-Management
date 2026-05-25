import { ipcMain } from 'electron';
import { pomodoroService } from '../services/pomodoro.service';

export function registerPomodoroIPC(): void {
	ipcMain.handle('pomodoro:getState', async () => {
		try {
			return { success: true, data: pomodoroService.getState() };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:getSettings', async () => {
		try {
			return { success: true, data: pomodoroService.getSettings() };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:updateSettings', async (_, { settings }) => {
		try {
			const data = await pomodoroService.updateSettings(settings);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:start', async () => {
		try {
			return { success: true, data: pomodoroService.start() };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:pause', async () => {
		try {
			return { success: true, data: pomodoroService.pause() };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:reset', async () => {
		try {
			return { success: true, data: pomodoroService.reset() };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:skip', async () => {
		try {
			return { success: true, data: pomodoroService.skip() };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('pomodoro:setMode', async (_, { mode }) => {
		try {
			return { success: true, data: pomodoroService.setMode(mode) };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});
}
