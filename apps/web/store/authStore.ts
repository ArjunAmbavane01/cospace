import { User } from 'better-auth';
import { create } from 'zustand'

interface IAuth {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void,
  setToken: (user: string | null) => void,
  setLoading: (loading: boolean) => void,
}

const useAuthStore = create<IAuth>((set) => ({
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  user: null,
  token: null,
  loading: false,
}));

export default useAuthStore