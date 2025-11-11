import { create } from 'zustand';
import { Analysis } from '@/types';

export interface AnalysisFilters {
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}

interface AnalysisState {
  // Current analysis being viewed/edited
  currentAnalysis: Analysis | null;
  setCurrentAnalysis: (analysis: Analysis | null) => void;

  // Analyses list (cached from storage)
  analyses: Analysis[];
  setAnalyses: (analyses: Analysis[]) => void;
  addAnalysis: (analysis: Analysis) => void;
  updateAnalysisInList: (id: string, updates: Partial<Analysis>) => void;
  removeAnalysis: (id: string) => void;
  clearAnalyses: () => void;

  // Filters and sorting
  filters: AnalysisFilters;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSortBy: (sortBy: 'date' | 'name') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  resetFilters: () => void;

  // Selection (for batch operations)
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
}

const initialFilters: AnalysisFilters = {
  searchQuery: '',
  selectedTags: [],
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // Current analysis
  currentAnalysis: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  // Analyses list
  analyses: [],
  setAnalyses: (analyses) => set({ analyses }),

  addAnalysis: (analysis) =>
    set((state) => ({
      analyses: [analysis, ...state.analyses],
    })),

  updateAnalysisInList: (id, updates) =>
    set((state) => ({
      analyses: state.analyses.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    })),

  removeAnalysis: (id) =>
    set((state) => ({
      analyses: state.analyses.filter((a) => a.id !== id),
      // Clear current analysis if it's the one being removed
      currentAnalysis:
        state.currentAnalysis?.id === id ? null : state.currentAnalysis,
      // Remove from selection if selected
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  clearAnalyses: () =>
    set({
      analyses: [],
      currentAnalysis: null,
      selectedIds: [],
    }),

  // Filters
  filters: initialFilters,

  setSearchQuery: (query) =>
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    })),

  setSelectedTags: (tags) =>
    set((state) => ({
      filters: { ...state.filters, selectedTags: tags },
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      filters: { ...state.filters, sortBy },
    })),

  setSortOrder: (order) =>
    set((state) => ({
      filters: { ...state.filters, sortOrder: order },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  // Selection
  selectedIds: [],

  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    })),

  selectAll: () =>
    set((state) => ({
      selectedIds: state.analyses.map((a) => a.id),
    })),

  clearSelection: () => set({ selectedIds: [] }),

  isSelected: (id) => get().selectedIds.includes(id),
}));

/**
 * Helper function to get filtered and sorted analyses
 */
export function getFilteredAnalyses(
  analyses: Analysis[],
  filters: AnalysisFilters
): Analysis[] {
  let filtered = [...analyses];

  // Apply search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.templateName.toLowerCase().includes(query) ||
        (a.userNote && a.userNote.toLowerCase().includes(query))
    );
  }

  // Apply tag filter
  if (filters.selectedTags.length > 0) {
    filtered = filtered.filter((a) =>
      filters.selectedTags.some((tag) => a.tags.includes(tag))
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    if (filters.sortBy === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (filters.sortBy === 'name') {
      comparison = a.templateName.localeCompare(b.templateName);
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
}
