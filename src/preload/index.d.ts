export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface IAuthAPI {
  login: (email: string, password: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; data?: AuthResponse; error?: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; data?: TokenPayload; error?: string }>;
}

declare global {
  interface Window {
    api: {
      auth: IAuthAPI;
    }
  }
}