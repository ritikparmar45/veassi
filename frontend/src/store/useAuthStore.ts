import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  schoolName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Ensure safe local storage access for Next.js SSR
const isClient = typeof window !== 'undefined';
const storedUser = isClient ? localStorage.getItem('vedaUser') : null;
const storedToken = isClient ? localStorage.getItem('vedaToken') : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  login: (user, token) => {
    if (isClient) {
      localStorage.setItem('vedaUser', JSON.stringify(user));
      localStorage.setItem('vedaToken', token);
    }
    set({ user, token });
  },
  logout: () => {
    if (isClient) {
      localStorage.removeItem('vedaUser');
      localStorage.removeItem('vedaToken');
    }
    set({ user: null, token: null });
  },
}));
