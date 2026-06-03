export const EventStatusColor = {
  todo: '#93C5FD',
  canceled: '#FCA5A5',
  done: '#10B981'
} as const;

export type EventStatusColorKey = keyof typeof EventStatusColor;
