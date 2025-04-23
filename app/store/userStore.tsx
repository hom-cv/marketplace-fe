import { create } from "zustand";

type User = {
  id: string;
  email_address: string;
  username: string;
  first_name: string;
  last_name: string;
  status: string;
} | null;

type UserStore = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
