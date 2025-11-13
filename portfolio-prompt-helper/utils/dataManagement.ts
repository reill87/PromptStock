import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Analysis } from '@/types';
import { getAnalyses } from './storage';

export interface ExportData {
  version: string;
  exportDate: string;
  analyses: Analysis[];
  totalCount: number;
}

/**
 * Export all analyses to a JSON file
 */
export async function exportData(): Promise<{ success: boolean; message: string }> {
  try {
    const analyses = await getAnalyses();

    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      analyses,
      totalCount: analyses.length,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;

    if (Platform.OS === 'web') {
      // Web: use Blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Native: use FileSystem and Sharing
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: '포트폴리오 데이터 내보내기',
          UTI: 'public.json',
        });
      }
    }

    return {
      success: true,
      message: `${analyses.length}개의 분석 데이터를 내보냈습니다.`,
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      success: false,
      message: '데이터 내보내기 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Import analyses from a JSON file
 */
export async function importData(): Promise<{
  success: boolean;
  message: string;
  importedCount?: number;
}> {
  try {
    // Pick a document
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return {
        success: false,
        message: '파일 선택이 취소되었습니다.',
      };
    }

    const fileUri = result.assets[0].uri;

    // Read the file
    let fileContent: string;
    if (Platform.OS === 'web') {
      // Web: use fetch
      const response = await fetch(fileUri);
      fileContent = await response.text();
    } else {
      // Native: use FileSystem
      fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    // Parse JSON
    const importData: ExportData = JSON.parse(fileContent);

    // Validate structure
    if (!importData.analyses || !Array.isArray(importData.analyses)) {
      throw new Error('Invalid data format');
    }

    // Get existing analyses
    const existingAnalyses = await getAnalyses();
    const existingIds = new Set(existingAnalyses.map((a) => a.id));

    // Filter out duplicates
    const newAnalyses = importData.analyses.filter(
      (analysis) => !existingIds.has(analysis.id)
    );

    // Merge with existing data
    const mergedAnalyses = [...existingAnalyses, ...newAnalyses];

    // Save to storage
    await AsyncStorage.setItem(
      '@portfolio_analyses',
      JSON.stringify(mergedAnalyses)
    );

    return {
      success: true,
      message: `${newAnalyses.length}개의 새로운 분석을 가져왔습니다.`,
      importedCount: newAnalyses.length,
    };
  } catch (error) {
    console.error('Error importing data:', error);
    return {
      success: false,
      message: '데이터 가져오기 중 오류가 발생했습니다. 올바른 백업 파일인지 확인해주세요.',
    };
  }
}

/**
 * Clear all app data (analyses and settings)
 */
export async function clearAllData(): Promise<{ success: boolean; message: string }> {
  try {
    // Clear analyses
    await AsyncStorage.removeItem('@portfolio_analyses');

    // Clear settings (reset to defaults)
    await AsyncStorage.removeItem('@portfolio_settings');

    return {
      success: true,
      message: '모든 데이터가 삭제되었습니다.',
    };
  } catch (error) {
    console.error('Error clearing data:', error);
    return {
      success: false,
      message: '데이터 삭제 중 오류가 발생했습니다.',
    };
  }
}

/**
 * Get app data size (approximate)
 */
export async function getDataSize(): Promise<{ sizeInKB: number; analysisCount: number }> {
  try {
    const analyses = await getAnalyses();
    const jsonString = JSON.stringify(analyses);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInKB = Math.round(sizeInBytes / 1024);

    return {
      sizeInKB,
      analysisCount: analyses.length,
    };
  } catch (error) {
    console.error('Error getting data size:', error);
    return {
      sizeInKB: 0,
      analysisCount: 0,
    };
  }
}
