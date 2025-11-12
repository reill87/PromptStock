import AsyncStorage from '@react-native-async-storage/async-storage';
import { Template } from '@/types';

const CUSTOM_TEMPLATES_KEY = '@portfolio_custom_templates';

/**
 * Get all custom templates from storage
 */
export async function getCustomTemplates(): Promise<Template[]> {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting custom templates:', error);
    return [];
  }
}

/**
 * Save a new custom template
 */
export async function saveCustomTemplate(template: Template): Promise<void> {
  try {
    const templates = await getCustomTemplates();

    // Ensure it's marked as custom
    const customTemplate = {
      ...template,
      isCustom: true,
      createdAt: template.createdAt || new Date().toISOString(),
      usageCount: template.usageCount || 0,
    };

    templates.unshift(customTemplate);
    await AsyncStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving custom template:', error);
    throw new Error('템플릿 저장 중 오류가 발생했습니다');
  }
}

/**
 * Update an existing custom template
 */
export async function updateCustomTemplate(
  id: string,
  updates: Partial<Template>
): Promise<void> {
  try {
    const templates = await getCustomTemplates();
    const index = templates.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error('템플릿을 찾을 수 없습니다');
    }

    templates[index] = {
      ...templates[index],
      ...updates,
      isCustom: true, // Always ensure it remains custom
    };

    await AsyncStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error updating custom template:', error);
    throw new Error('템플릿 업데이트 중 오류가 발생했습니다');
  }
}

/**
 * Delete a custom template
 */
export async function deleteCustomTemplate(id: string): Promise<void> {
  try {
    const templates = await getCustomTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    await AsyncStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting custom template:', error);
    throw new Error('템플릿 삭제 중 오류가 발생했습니다');
  }
}

/**
 * Get a custom template by ID
 */
export async function getCustomTemplateById(id: string): Promise<Template | null> {
  try {
    const templates = await getCustomTemplates();
    return templates.find((t) => t.id === id) || null;
  } catch (error) {
    console.error('Error getting custom template:', error);
    return null;
  }
}

/**
 * Increment usage count for a custom template
 */
export async function incrementTemplateUsage(id: string): Promise<void> {
  try {
    const templates = await getCustomTemplates();
    const index = templates.findIndex((t) => t.id === id);

    if (index !== -1) {
      templates[index].usageCount = (templates[index].usageCount || 0) + 1;
      await AsyncStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    }
  } catch (error) {
    console.error('Error incrementing template usage:', error);
  }
}

/**
 * Get custom template statistics
 */
export async function getCustomTemplateStats(): Promise<{
  totalCustom: number;
  mostUsedTemplate: Template | null;
}> {
  try {
    const templates = await getCustomTemplates();

    let mostUsed: Template | null = null;
    if (templates.length > 0) {
      mostUsed = templates.reduce((prev, current) =>
        (current.usageCount > prev.usageCount) ? current : prev
      );
    }

    return {
      totalCustom: templates.length,
      mostUsedTemplate: mostUsed,
    };
  } catch (error) {
    console.error('Error getting custom template stats:', error);
    return {
      totalCustom: 0,
      mostUsedTemplate: null,
    };
  }
}
