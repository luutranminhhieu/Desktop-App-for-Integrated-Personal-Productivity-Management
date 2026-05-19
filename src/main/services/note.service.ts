import mongoose from 'mongoose';
import { INote, Note } from '../models/Note';

type ListNoteOptions = {
  userId: string;
  query?: string;
  tags?: string[];
  limit?: number;
};

const DEFAULT_LIST_LIMIT = 200;

export class NoteService {
  public async createNote(payload: Partial<INote>): Promise<INote> {
    if (!payload.title) {
      throw new Error('Title is required.');
    }
    if (!payload.userId) {
      throw new Error('User is required.');
    }

    return Note.create(payload);
  }

  public async listNotes(options: ListNoteOptions): Promise<INote[]> {
    const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(options.userId) };

    if (options.query) {
      const regex = new RegExp(options.query, 'i');
      filter.$or = [{ title: regex }, { content: regex }];
    }

    if (options.tags && options.tags.length > 0) {
      filter.tags = { $in: options.tags };
    }

    return Note.find(filter).sort({ updatedAt: -1 }).limit(options.limit ?? DEFAULT_LIST_LIMIT);
  }

  public async updateNote(noteId: string, updates: Partial<INote>, userId: string): Promise<INote> {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: new mongoose.Types.ObjectId(userId) },
      updates,
      { new: true }
    );

    if (!note) {
      throw new Error('Note not found.');
    }

    return note;
  }

  public async deleteNote(noteId: string, userId: string): Promise<void> {
    const result = await Note.findOneAndDelete({ _id: noteId, userId: new mongoose.Types.ObjectId(userId) });
    if (!result) {
      throw new Error('Note not found.');
    }
  }

  public async getNoteCount(userId: string): Promise<number> {
    return Note.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });
  }
}

export const noteService = new NoteService();
