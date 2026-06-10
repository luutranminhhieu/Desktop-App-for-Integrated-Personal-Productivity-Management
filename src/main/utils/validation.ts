import { z } from 'zod';

function toDateOrUndefined(val: unknown): Date | undefined {
  if (val == null || val === '') return undefined;
  const d = new Date(val as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toDate(val: unknown): Date {
  return new Date(val as string);
}

export const SubTodoSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Subtask title is required'),
  status: z.enum(['todo', 'completed']).default('todo'),
  completedAt: z.string().nullable().optional()
});

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['todo', 'completed', 'canceled']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  columnId: z.number().optional(),
  tags: z.array(z.string()).default([]),
  userId: z.string().min(1, 'User ID is required'),
  project: z.string().optional(),
  focusMinutes: z.number().nonnegative().default(0),
  focusDate: z.string().optional(),
  completedAt: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  subtasks: z.array(SubTodoSchema).optional()
});

export const UpdateTodoSchema = z.object({
  todoId: z.string().min(1, 'Todo ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  updates: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['todo', 'completed', 'canceled']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    startDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),
    columnId: z.number().nullable().optional(),
    tags: z.array(z.string()).optional(),
    project: z.string().optional(),
    focusMinutes: z.number().nonnegative().optional(),
    focusDate: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    subtasks: z.array(SubTodoSchema).optional()
  })
});

export { toDate, toDateOrUndefined };
