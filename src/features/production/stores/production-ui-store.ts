import { create } from 'zustand';

import type { ProductionCardStatus, OrderPriority } from '@/types/domain';

interface ProductionUIState {
  // Selected card
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;

  // Filters
  filterStatus: ProductionCardStatus | 'all';
  filterPriority: OrderPriority | 'all';
  searchQuery: string;
  setFilterStatus: (status: ProductionCardStatus | 'all') => void;
  setFilterPriority: (priority: OrderPriority | 'all') => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // Problem dialog
  problemDialogOpen: boolean;
  problemCardId: string | null;
  openProblemDialog: (cardId: string) => void;
  closeProblemDialog: () => void;

  // Notes dialog
  notesDialogOpen: boolean;
  notesCardId: string | null;
  notesAction: 'complete' | 'pause' | null;
  openNotesDialog: (cardId: string, action: 'complete' | 'pause') => void;
  closeNotesDialog: () => void;
}

export const useProductionUIStore = create<ProductionUIState>((set) => ({
  // Selected card
  selectedCardId: null,
  setSelectedCardId: (id) => set({ selectedCardId: id }),

  // Filters
  filterStatus: 'all',
  filterPriority: 'all',
  searchQuery: '',
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () =>
    set({
      filterStatus: 'all',
      filterPriority: 'all',
      searchQuery: '',
    }),

  // Problem dialog
  problemDialogOpen: false,
  problemCardId: null,
  openProblemDialog: (cardId) => set({ problemDialogOpen: true, problemCardId: cardId }),
  closeProblemDialog: () => set({ problemDialogOpen: false, problemCardId: null }),

  // Notes dialog
  notesDialogOpen: false,
  notesCardId: null,
  notesAction: null,
  openNotesDialog: (cardId, action) =>
    set({ notesDialogOpen: true, notesCardId: cardId, notesAction: action }),
  closeNotesDialog: () =>
    set({ notesDialogOpen: false, notesCardId: null, notesAction: null }),
}));
