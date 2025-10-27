import { User } from 'better-auth';
import { create } from 'zustand'

interface IAuth {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void,
}

const useAuthStore = create<IAuth>((set) => ({
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  user: null,
  loading: false,
}));

export default useAuthStore