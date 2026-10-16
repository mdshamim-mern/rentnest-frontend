import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavoritesStore = create<{ ids: string[]; toggle: (id: string) => void }>()(persist((set) => ({
  ids: [],
  toggle: (id) => set(state => ({ ids: state.ids.includes(id) ? state.ids.filter(item => item !== id) : [...state.ids, id] })),
}), { name: 'rentnest-favorites' }));
