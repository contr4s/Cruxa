import { create } from 'zustand';

interface UiState {
  sidebarExpanded: boolean;
  selectedGymId: string | null;
  setSidebarExpanded: (expanded: boolean) => void;
  setSelectedGymId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarExpanded: false,
  selectedGymId: null,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  setSelectedGymId: (id) => set({ selectedGymId: id }),
}));
