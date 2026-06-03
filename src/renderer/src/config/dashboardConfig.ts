//Locale settings
export const DASHBOARD_LOCALE = 'en-US';

export const TASK_DONUT_CONFIG = {
  RADIUS: 70,
  get CIRCUMFERENCE() {
    return 2 * Math.PI * this.RADIUS; // ≈ 439.82
  },
  SVG_SIZE: 160,
  CENTER: 80,
  STROKE_WIDTH: 15
};

// 4. UI Translation Strings for Dashboard
export const DASHBOARD_STRINGS = {
  // Task Status Card
  taskStatusTitle: 'Task Status',
  taskTotalLabel: 'Totals',
  taskDone: 'Done',
  taskPending: 'To-do',
  taskOverdue: 'Expired',

  // Heatmap Card
  heatmapTitle: 'Activity in year',
  heatmapLess: 'Low',
  heatmapMore: 'High',
  heatmapSuffix: 'activity',
  dayLabels: ['', 'Mon', '', 'Wed', '', 'Fri', ''],

  // API/Guard errors
  authError: 'No authentication token.',
  tokenError: 'Unable to authenticate token.',
  fetchError: 'Unable to load dashboard data.',
  noData: 'No data available.'
};
