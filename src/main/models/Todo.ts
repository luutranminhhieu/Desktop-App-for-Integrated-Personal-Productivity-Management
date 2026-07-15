import mongoose, { Document, Schema } from 'mongoose';

export type TodoStatus = 'todo' | 'completed' | 'canceled';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface ISubTodo {
	_id: string;
	title: string;
	status: 'todo' | 'completed';
	completedAt?: Date;
}

export interface ITodo extends Document {
	title: string;
	description?: string;
	status: TodoStatus;
	priority: TodoPriority;
	startDate?: Date;
	dueDate?: Date;
	columnId?: number;
	tags: string[];
	userId: mongoose.Types.ObjectId;
	project?: string;
	focusMinutes: number;
	focusDate?: Date;
	completedAt?: Date;
	categoryId: string | null;
	sortOrder: number;
	subtasks?: ISubTodo[];
}

const SubTodoSchema = new Schema(
	{
		_id: { type: String, required: true },
		title: { type: String, required: true, trim: true },
		status: {
			type: String,
			enum: ['todo', 'completed'],
			default: 'todo'
		},
		completedAt: { type: Date }
	},
	{ _id: false, timestamps: true }
);

const TodoSchema = new Schema<ITodo>(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: '' },
		status: {
			type: String,
			enum: ['todo', 'completed', 'canceled'],
			default: 'todo'
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high'],
			default: 'medium'
		},
		startDate: { type: Date },
		dueDate: { type: Date },
		columnId: { type: Number, default: 1 },
		tags: { type: [String], default: [] },
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		project: { type: String, default: '' },
		focusMinutes: { type: Number, default: 0, min: 0 },
		focusDate: { type: Date },
		completedAt: { type: Date },
		categoryId: { type: String, default: null },
		sortOrder: { type: Number, default: 0 },
		subtasks: { type: [SubTodoSchema], default: [] }
	},
	{ timestamps: true }
);

export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);

