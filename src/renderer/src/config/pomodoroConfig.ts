export const POMODORO_CONFIG = {
  // Locale
  LOCALE: 'vi-VN',

  // UI elements & Labels
  STRINGS: {
    focusSessionsLabel: 'Phiên tập trung',
    totalTimeLabel: 'Tổng thời gian'
  },

  // Dynamic formatting strings
  FORMATS: {
    hoursAndMinutes: (hours: number, minutes: number): string => `${hours}h ${minutes}m`,
    minutesOnly: (minutes: number): string => `${minutes}m`
  }
};
