export interface IAuthAPI {
  login: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; data?: any; error?: string }>;
}

declare global {
  interface Window {
    api: {
      auth: IAuthAPI;
    }
  }
}