export const EventStatusColor = {
  todo: '#ffffff',
  inProgress: '#1E3A8A',
  paused: '#F59E0B',
  canceled: '#EF4444',
  done: '#10B981'
} as const;

export type EventStatusColorKey = keyof typeof EventStatusColor;
