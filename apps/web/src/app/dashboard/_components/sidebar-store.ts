import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeStore = {
  isCollapsed: boolean;
  setIsCollapsed: () => void;
};

export const useSidebarStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      setIsCollapsed: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed }))
    }),
    {
      name: 'isCollapsed', // name of item in the storage (must be unique)
      partialize: (state) => ({ isCollapsed: state.isCollapsed })
    }
  )
);
