import { z } from 'zod';

function toDateOrUndefined(val: unknown): Date | undefined {
  if (val == null || val === '') return undefined;
  const d = new Date(val as string);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toDate(val: unknown): Date {
  return new Date(val as string);
}

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['backlog', 'pending', 'in_progress', 'completed', 'canceled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  userId: z.string().min(1, 'User ID is required'),
  project: z.string().optional(),
  focusMinutes: z.number().nonnegative().default(0),
  focusDate: z.string().optional(),
  completedAt: z.string().optional(),
  categoryId: z.string().nullable().optional()
});

export const UpdateTodoSchema = z.object({
  todoId: z.string().min(1, 'Todo ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  updates: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['backlog', 'pending', 'in_progress', 'completed', 'canceled']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    dueDate: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    project: z.string().optional(),
    focusMinutes: z.number().nonnegative().optional(),
    focusDate: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional()
  })
});

export const CreateCalendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  color: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'tentative', 'canceled', 'completed']).default('confirmed'),
  userId: z.string().min(1, 'User ID is required'),
  location: z.string().optional(),
  notes: z.string().optional()
});

export const UpdateCalendarEventSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  updates: z.object({
    title: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    color: z.string().optional(),
    status: z.enum(['pending', 'confirmed', 'tentative', 'canceled', 'completed']).optional(),
    location: z.string().optional(),
    notes: z.string().optional()
  })
});

export { toDate, toDateOrUndefined };
