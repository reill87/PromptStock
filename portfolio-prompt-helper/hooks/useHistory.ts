import { useState, useEffect } from 'react';
import { Analysis } from '@/types';
import { useUIStore } from '@/store/uiStore';
import {
  saveAnalysis,
  getAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
  deleteAnalyses,
  clearAllAnalyses,
  searchAnalyses,
  filterAnalysesByTags,
  getAllTags,
  getStorageStats,
} from '@/utils/storage';

export function useHistory() {
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const showToast = useUIStore((state) => state.showToast);

  /**
   * Load all analyses from storage
   */
  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const data = await getAnalyses();
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
      showToast('error', '히스토리를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load all tags from storage
   */
  const loadTags = async () => {
    try {
      const tags = await getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  /**
   * Save a new analysis to history
   */
  const saveToHistory = async (
    analysisData: Omit<Analysis, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Analysis | null> => {
    setLoading(true);
    try {
      const newAnalysis: Analysis = {
        ...analysisData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveAnalysis(newAnalysis);
      showToast('success', '히스토리에 저장되었습니다');

      // Reload analyses to reflect the new one
      await loadAnalyses();
      await loadTags();

      return newAnalysis;
    } catch (error) {
      console.error('Error saving to history:', error);
      showToast('error', '히스토리 저장에 실패했습니다');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing analysis
   */
  const updateHistory = async (
    id: string,
    updates: Partial<Analysis>
  ): Promise<boolean> => {
    setLoading(true);
    try {
      await updateAnalysis(id, updates);
      showToast('success', '히스토리가 업데이트되었습니다');

      // Reload analyses to reflect changes
      await loadAnalyses();
      await loadTags();

      return true;
    } catch (error) {
      console.error('Error updating history:', error);
      showToast('error', '히스토리 업데이트에 실패했습니다');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a single analysis by ID
   */
  const deleteFromHistory = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteAnalysis(id);
      showToast('success', '히스토리가 삭제되었습니다');

      // Reload analyses
      await loadAnalyses();
      await loadTags();

      return true;
    } catch (error) {
      console.error('Error deleting from history:', error);
      showToast('error', '히스토리 삭제에 실패했습니다');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete multiple analyses by IDs
   */
  const deleteMultiple = async (ids: string[]): Promise<boolean> => {
    setLoading(true);
    try {
      await deleteAnalyses(ids);
      showToast('success', `${ids.length}개의 히스토리가 삭제되었습니다`);

      // Reload analyses
      await loadAnalyses();
      await loadTags();

      return true;
    } catch (error) {
      console.error('Error deleting multiple:', error);
      showToast('error', '히스토리 삭제에 실패했습니다');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear all analyses (with confirmation)
   */
  const clearHistory = async (): Promise<boolean> => {
    setLoading(true);
    try {
      await clearAllAnalyses();
      showToast('success', '모든 히스토리가 삭제되었습니다');

      // Reset state
      setAnalyses([]);
      setAllTags([]);

      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      showToast('error', '히스토리 삭제에 실패했습니다');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search analyses by query
   */
  const search = async (query: string): Promise<void> => {
    if (!query.trim()) {
      await loadAnalyses();
      return;
    }

    setLoading(true);
    try {
      const results = await searchAnalyses(query);
      setAnalyses(results);
    } catch (error) {
      console.error('Error searching:', error);
      showToast('error', '검색에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter analyses by tags
   */
  const filterByTags = async (tags: string[]): Promise<void> => {
    if (tags.length === 0) {
      await loadAnalyses();
      return;
    }

    setLoading(true);
    try {
      const results = await filterAnalysesByTags(tags);
      setAnalyses(results);
    } catch (error) {
      console.error('Error filtering by tags:', error);
      showToast('error', '필터링에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a single analysis by ID
   */
  const getById = async (id: string): Promise<Analysis | null> => {
    setLoading(true);
    try {
      const analysis = await getAnalysisById(id);
      return analysis;
    } catch (error) {
      console.error('Error getting analysis by ID:', error);
      showToast('error', '히스토리를 불러오는데 실패했습니다');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get storage statistics
   */
  const getStats = async () => {
    try {
      const stats = await getStorageStats();
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  };

  // Load analyses on mount
  useEffect(() => {
    loadAnalyses();
    loadTags();
  }, []);

  return {
    // State
    loading,
    analyses,
    allTags,

    // Methods
    loadAnalyses,
    loadTags,
    saveToHistory,
    updateHistory,
    deleteFromHistory,
    deleteMultiple,
    clearHistory,
    search,
    filterByTags,
    getById,
    getStats,
  };
}
