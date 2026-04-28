import { ipcMain } from 'electron';
import { authService } from '../services/auth.service';

export function registerAuthIPC() {
  ipcMain.handle('auth:login', async (_, { email, password }) => {
    try {
      const result = await authService.login(email, password);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('auth:register', async (_, { email, password, name }) => {
    try {
      const result = await authService.register(email, password, name);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('auth:verifyToken', async (_, { token }) => {
    try {
      const result = authService.verifyToken(token);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}