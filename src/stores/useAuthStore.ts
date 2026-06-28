import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { GetInfoResult } from '../api/auth';

interface AuthState {
  token: string;
  userInfo: GetInfoResult['user'] | null;
  roles: string[];
  permissions: string[];
  setToken: (token: string) => void;
  setUserInfo: (info: GetInfoResult['user']) => void;
  setRoles: (roles: string[]) => void;
  setPermissions: (permissions: string[]) => void;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || '',
  userInfo: null,
  roles: [],
  permissions: [],
  setToken: (token: string) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setUserInfo: (userInfo) => set({ userInfo }),
  setRoles: (roles: string[]) => set({ roles }),
  setPermissions: (permissions: string[]) => set({ permissions }),
  fetchUserInfo: async () => {
    const res = await authApi.getInfo();
    set({
      userInfo: res.data.user,
      roles: res.data.roles,
      permissions: res.data.permissions,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: '', userInfo: null, roles: [], permissions: [] });
  },
}));

export default useAuthStore;
