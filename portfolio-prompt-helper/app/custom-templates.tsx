import React, { useState } from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Template } from '@/types';
import { CustomTemplatesList } from '@/components/template/CustomTemplatesList';
import { TemplateEditor } from '@/components/template/TemplateEditor';
import { Button } from '@/components/common/Button';
import { useUIStore } from '@/store/uiStore';
import {
  saveCustomTemplate,
  updateCustomTemplate,
} from '@/utils/templateStorage';

export default function CustomTemplatesScreen() {
  const [editorVisible, setEditorVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | undefined>();
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { showToast } = useUIStore();

  const handleCreate = () => {
    setEditingTemplate(undefined);
    setEditorVisible(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setEditorVisible(true);
  };

  const handleSave = async (
    templateData: Omit<Template, 'id' | 'createdAt' | 'usageCount'>
  ) => {
    try {
      setSaving(true);

      if (editingTemplate) {
        // Update existing template
        await updateCustomTemplate(editingTemplate.id, templateData);
        showToast('success', '템플릿이 수정되었습니다');
      } else {
        // Create new template
        const newTemplate: Template = {
          ...templateData,
          id: `custom-${Date.now()}`,
          createdAt: new Date().toISOString(),
          usageCount: 0,
          isCustom: true,
        };
        await saveCustomTemplate(newTemplate);
        showToast('success', '템플릿이 생성되었습니다');
      }

      setEditorVisible(false);
      setEditingTemplate(undefined);
      setRefreshKey((prev) => prev + 1); // Trigger refresh
    } catch (error) {
      console.error('Error saving template:', error);
      showToast('error', '템플릿 저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditorVisible(false);
    setEditingTemplate(undefined);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: '커스텀 템플릿',
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleCreate}>
              <Ionicons name="add-circle-outline" size={28} color="#3B82F6" />
            </TouchableOpacity>
          ),
        }}
      />

      <CustomTemplatesList
        key={refreshKey}
        onEdit={handleEdit}
        onRefresh={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={handleCreate}
          className="bg-blue-500 rounded-full w-14 h-14 items-center justify-center shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Editor Modal */}
      <Modal
        visible={editorVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancel}>
        <View className="flex-1">
          <Stack.Screen
            options={{
              title: editingTemplate ? '템플릿 편집' : '새 템플릿',
              headerStyle: { backgroundColor: '#fff' },
              headerShadowVisible: false,
              headerLeft: () => (
                <TouchableOpacity onPress={handleCancel}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              ),
            }}
          />

          <TemplateEditor
            template={editingTemplate}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={saving}
          />
        </View>
      </Modal>
    </View>
  );
}
