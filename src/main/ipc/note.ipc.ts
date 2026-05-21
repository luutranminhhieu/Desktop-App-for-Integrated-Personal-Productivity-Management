import { ipcMain } from 'electron';
import { noteService } from '../services/note.service';

export function registerNoteIPC(): void {
	ipcMain.handle('note:create', async (_, payload) => {
		try {
			const data = await noteService.createNote(payload);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('note:list', async (_, options) => {
		try {
			const data = await noteService.listNotes(options);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('note:update', async (_, { noteId, updates, userId }) => {
		try {
			const data = await noteService.updateNote(noteId, updates, userId);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('note:delete', async (_, { noteId, userId }) => {
		try {
			await noteService.deleteNote(noteId, userId);
			return { success: true };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});

	ipcMain.handle('note:count', async (_, { userId }) => {
		try {
			const data = await noteService.getNoteCount(userId);
			return { success: true, data };
		} catch (error) {
			return { success: false, error: (error as Error).message };
		}
	});
}
