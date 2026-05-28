import { z } from 'zod';

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['backlog', 'pending', 'in_progress', 'completed', 'canceled']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  tags: z.array(z.string()).default([]),
  userId: z.string().min(1, 'User ID is required'),
  project: z.string().optional(),
  focusMinutes: z.number().nonnegative().default(0),
  focusDate: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
  completedAt: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
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
    dueDate: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    tags: z.array(z.string()).optional(),
    project: z.string().optional(),
    focusMinutes: z.number().nonnegative().optional(),
    focusDate: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    completedAt: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    categoryId: z.string().nullable().optional()
  })
});

export const CreateCalendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startTime: z.preprocess((val) => new Date(val as string), z.date()),
  endTime: z.preprocess((val) => new Date(val as string), z.date()),
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
    startTime: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    endTime: z.preprocess((val) => (val ? new Date(val as string) : undefined), z.date().optional()),
    color: z.string().optional(),
    status: z.enum(['pending', 'confirmed', 'tentative', 'canceled', 'completed']).optional(),
    location: z.string().optional(),
    notes: z.string().optional()
  })
});
