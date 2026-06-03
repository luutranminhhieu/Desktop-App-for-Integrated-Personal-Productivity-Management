export const POMODORO_CONFIG = {
  // Locale
  LOCALE: 'en-US',

  // UI elements & Labels
  STRINGS: {
    settingsTitle: 'Setting',
    sessionsPerDayTitle: 'Session',
    sessionsPerDaySubtitle: 'Today',
    workMinutesTitle: 'Work',
    workMinutesSubtitle: 'Max (minutes)',
    shortBreakMinutesTitle: 'Break',
    shortBreakMinutesSubtitle: 'Max (minutes)',
    modeLabels: {
      work: 'Pomodoro',
      short_break: 'Break',
      sessions: 'Section'
    }
  },

  // Dynamic formatting strings
  FORMATS: {
    hoursAndMinutes: (hours: number, minutes: number): string => `${hours}h ${minutes}m`,
    minutesOnly: (minutes: number): string => `${minutes}m`
  }
};
