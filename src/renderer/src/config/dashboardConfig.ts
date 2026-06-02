// 1. Locale settings
export const DASHBOARD_LOCALE = 'vi-VN';

// 2. Default target hours for daily focus
export const DEFAULT_FOCUS_GOAL = 6;

// 3. SVG Rings Geometry Configurations
export const FOCUS_RING_CONFIG = {
  RADIUS: 48,
  get CIRCUMFERENCE() {
    return 2 * Math.PI * this.RADIUS; // ≈ 301.59
  },
  SVG_SIZE: 110,
  CENTER: 55,
  STROKE_WIDTH: 9
};

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
  // Focus Card
  focusTitle: 'Daily focus time',
  focusHoursLabel: 'Time',

  // Task Status Card
  taskStatusTitle: 'Trạng thái Task',
  taskTotalLabel: 'Tổng số',
  taskDone: 'Đã xong',
  taskPending: 'Đang làm',
  taskOverdue: 'Quá hạn',
  taskCanceled: 'Hủy',

  // Heatmap Card
  heatmapTitle: 'Hoạt động trong năm',
  heatmapLess: 'Ít',
  heatmapMore: 'Nhiều',
  heatmapSuffix: 'hoạt động',
  dayLabels: ['', 'T2', '', 'T4', '', 'T6', ''],

  // API/Guard errors
  authError: 'Thiếu token xác thực.',
  tokenError: 'Không thể xác thực token.',
  fetchError: 'Không thể tải dữ liệu dashboard.',
  noData: 'Không có dữ liệu.'
};
