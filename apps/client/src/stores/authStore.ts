import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  validate: () => {},
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
