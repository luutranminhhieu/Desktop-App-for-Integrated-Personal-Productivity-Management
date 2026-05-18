import { ipcMain } from 'electron';
import { authService } from '../services/auth.service';

export function registerAuthIPC(): void {
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

  ipcMain.handle('auth:googleSignIn', async () => {
    try {
      const result = await authService.googleSignIn();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('auth:requestPasswordReset', async (_, { email }) => {
    try {
      await authService.requestPasswordReset(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('auth:resendPasswordReset', async (_, { email }) => {
    try {
      await authService.resendPasswordReset(email);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('auth:resetPassword', async (_, { token, newPassword }) => {
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  });
}