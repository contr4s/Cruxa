import { create } from 'zustand';
import type { PostAscentDto } from '../types/post';

interface DraftState {
  status: 'idle' | 'active';
  postId: string | null;
  gymId: string | null;
  gymName: string | null;
  ascents: PostAscentDto[];
  createdAt: string | null;
  /** When set, AscentFormModal opens with this route pre-selected */
  ascentModalTarget: { routeId?: string } | null;
  /** When true, StartWorkoutSheet opens */
  startSheetOpen: boolean;
}

interface DraftActions {
  startDraft: (postId: string, gymId: string, gymName?: string) => void;
  addAscent: (ascent: PostAscentDto) => void;
  removeAscent: (id: string) => void;
  clearDraft: () => void;
  summary: () => { total: number };
  /** Open ascent modal, optionally with a pre-selected route */
  openAscentModal: (routeId?: string) => void;
  closeAscentModal: () => void;
  openStartSheet: () => void;
  closeStartSheet: () => void;
}

export const useDraftStore = create<DraftState & DraftActions>((set, get) => ({
  status: 'idle',
  postId: null,
  gymId: null,
  gymName: null,
  ascents: [],
  createdAt: null,
  ascentModalTarget: null,
  startSheetOpen: false,

  startDraft: (postId, gymId, gymName) =>
    set({
      status: 'active',
      postId,
      gymId,
      gymName: gymName ?? null,
      ascents: [],
      createdAt: new Date().toISOString(),
    }),

  addAscent: (ascent) =>
    set((s) => ({ ascents: [...s.ascents, ascent] })),

  removeAscent: (id) =>
    set((s) => ({ ascents: s.ascents.filter((a) => a.id !== id) })),

  clearDraft: () =>
    set({
      status: 'idle',
      postId: null,
      gymId: null,
      gymName: null,
      ascents: [],
      createdAt: null,
    }),

  summary: () => ({ total: get().ascents.length }),

  openAscentModal: (routeId?: string) => {
    if (routeId) set({ ascentModalTarget: { routeId } });
    else set({ ascentModalTarget: {} });
  },
  closeAscentModal: () => set({ ascentModalTarget: null }),
  openStartSheet: () => set({ startSheetOpen: true }),
  closeStartSheet: () => set({ startSheetOpen: false }),
}));
