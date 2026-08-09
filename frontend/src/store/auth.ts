import { create } from 'zustand';

const AUTH_KEY = 'tarot-admin-auth';
const PASSWORD_KEY = 'tarot-admin-password';
const DEFAULT_PASSWORD = 'admin123';

const loadAuth = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const getStoredPassword = (): string => {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
};

const loadPassword = (): string => {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
};

interface AuthStore {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: loadAuth(),
  
  login: (password: string) => {
    const storedPassword = loadPassword();
    if (password === storedPassword) {
      localStorage.setItem(AUTH_KEY, 'true');
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ isAuthenticated: false });
  },
  
  changePassword: (oldPassword: string, newPassword: string) => {
    const storedPassword = loadPassword();
    if (oldPassword === storedPassword) {
      localStorage.setItem(PASSWORD_KEY, newPassword);
      return true;
    }
    return false;
  },
}));
