import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analysis } from '@/types';

const STORAGE_KEY = '@portfolio_analyses';

/**
 * Save a new analysis to storage
 */
export async function saveAnalysis(analysis: Analysis): Promise<void> {
  try {
    const analyses = await getAnalyses();
    analyses.unshift(analysis); // Add to beginning (most recent first)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('분석 저장 중 오류가 발생했습니다');
  }
}

/**
 * Get all analyses from storage
 */
export async function getAnalyses(): Promise<Analysis[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting analyses:', error);
    return [];
  }
}

/**
 * Get a single analysis by ID
 */
export async function getAnalysisById(id: string): Promise<Analysis | null> {
  try {
    const analyses = await getAnalyses();
    return analyses.find((a) => a.id === id) || null;
  } catch (error) {
    console.error('Error getting analysis by ID:', error);
    return null;
  }
}

/**
 * Update an existing analysis
 */
export async function updateAnalysis(
  id: string,
  updates: Partial<Analysis>
): Promise<void> {
  try {
    const analyses = await getAnalyses();
    const index = analyses.findIndex((a) => a.id === id);

    if (index === -1) {
      throw new Error('분석을 찾을 수 없습니다');
    }

    analyses[index] = {
      ...analyses[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch (error) {
    console.error('Error updating analysis:', error);
    throw new Error('분석 업데이트 중 오류가 발생했습니다');
  }
}

/**
 * Delete an analysis by ID
 */
export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const analyses = await getAnalyses();
    const filtered = analyses.filter((a) => a.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw new Error('분석 삭제 중 오류가 발생했습니다');
  }
}

/**
 * Delete multiple analyses by IDs
 */
export async function deleteAnalyses(ids: string[]): Promise<void> {
  try {
    const analyses = await getAnalyses();
    const filtered = analyses.filter((a) => !ids.includes(a.id));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting analyses:', error);
    throw new Error('분석 삭제 중 오류가 발생했습니다');
  }
}

/**
 * Clear all analyses (use with caution!)
 */
export async function clearAllAnalyses(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing analyses:', error);
    throw new Error('분석 전체 삭제 중 오류가 발생했습니다');
  }
}

/**
 * Search analyses by query (searches in templateName and userNote)
 */
export async function searchAnalyses(query: string): Promise<Analysis[]> {
  try {
    const analyses = await getAnalyses();
    const lowerQuery = query.toLowerCase();

    return analyses.filter(
      (a) =>
        a.templateName.toLowerCase().includes(lowerQuery) ||
        (a.userNote && a.userNote.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching analyses:', error);
    return [];
  }
}

/**
 * Filter analyses by tags
 */
export async function filterAnalysesByTags(tags: string[]): Promise<Analysis[]> {
  try {
    const analyses = await getAnalyses();

    return analyses.filter((a) =>
      tags.some((tag) => a.tags.includes(tag))
    );
  } catch (error) {
    console.error('Error filtering analyses by tags:', error);
    return [];
  }
}

/**
 * Get all unique tags from all analyses
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const analyses = await getAnalyses();
    const tagsSet = new Set<string>();

    analyses.forEach((a) => {
      a.tags.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  } catch (error) {
    console.error('Error getting all tags:', error);
    return [];
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<{
  totalAnalyses: number;
  totalTags: number;
  oldestDate: string | null;
  newestDate: string | null;
}> {
  try {
    const analyses = await getAnalyses();
    const tags = await getAllTags();

    return {
      totalAnalyses: analyses.length,
      totalTags: tags.length,
      oldestDate: analyses.length > 0 ? analyses[analyses.length - 1].createdAt : null,
      newestDate: analyses.length > 0 ? analyses[0].createdAt : null,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      totalAnalyses: 0,
      totalTags: 0,
      oldestDate: null,
      newestDate: null,
    };
  }
}
