export const logger = {
  error: (message: string, error?: any): void => {
    console.error(`[ERROR] ${message}`, error !== undefined ? error : '');
  },
  info: (message: string): void => {
    console.log(`[INFO] ${message}`);
  },
  warn: (message: string): void => {
    console.warn(`[WARN] ${message}`);
  }
};
