import mongoose, { Document, Schema } from 'mongoose';

export type TodoStatus = 'backlog' | 'pending' | 'in_progress' | 'completed' | 'canceled';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ITodo extends Document {
	title: string;
	description?: string;
	status: TodoStatus;
	priority: TodoPriority;
	dueDate?: Date;
	tags: string[];
	userId: mongoose.Types.ObjectId;
	project?: string;
	focusMinutes: number;
	focusDate?: Date;
	completedAt?: Date;
	categoryId?: string | null;
}

const TodoSchema = new Schema<ITodo>(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: '' },
		status: {
			type: String,
			enum: ['backlog', 'pending', 'in_progress', 'completed', 'canceled'],
			default: 'pending'
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high', 'urgent'],
			default: 'medium'
		},
		dueDate: { type: Date },
		tags: { type: [String], default: [] },
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		project: { type: String, default: '' },
		focusMinutes: { type: Number, default: 0, min: 0 },
		focusDate: { type: Date },
		completedAt: { type: Date },
		categoryId: { type: String, default: null }
	},
	{ timestamps: true }
);

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);
