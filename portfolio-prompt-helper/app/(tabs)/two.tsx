import { View, Text, Pressable, Modal, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useHistory } from '@/hooks/useHistory';
import { useAnalysisStore, getFilteredAnalyses } from '@/store/analysisStore';
import { useUIStore } from '@/store/uiStore';
import { HistoryList } from '@/components/history/HistoryList';
import { HistoryDetail } from '@/components/history/HistoryDetail';
import { TagFilter } from '@/components/history/TagFilter';
import { DateRangeFilter } from '@/components/history/DateRangeFilter';
import { SortOptions } from '@/components/history/SortOptions';
import { TemplateTypeFilter } from '@/components/history/TemplateTypeFilter';
import { Button } from '@/components/common/Button';
import { Analysis } from '@/types';

export default function HistoryScreen() {
  const {
    loading,
    analyses,
    loadAnalyses,
    deleteFromHistory,
    deleteMultiple,
    updateHistory,
  } = useHistory();

  const {
    setAnalyses,
    currentAnalysis,
    setCurrentAnalysis,
    filters,
    setSearchQuery,
    setSelectedTags,
    setSelectedCategories,
    setDateRange,
    setSortBy,
    setSortOrder,
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
  } = useAnalysisStore();

  const showModal = useUIStore((state) => state.showModal);

  const [showDetail, setShowDetail] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showTemplateTypeFilter, setShowTemplateTypeFilter] = useState(false);

  // Sync analyses from storage to store
  useEffect(() => {
    setAnalyses(analyses);
  }, [analyses, setAnalyses]);

  // Get filtered analyses
  const filteredAnalyses = getFilteredAnalyses(analyses, filters);

  const handleItemPress = (analysis: Analysis) => {
    if (selectionMode) {
      toggleSelection(analysis.id);
    } else {
      setCurrentAnalysis(analysis);
      setShowDetail(true);
    }
  };

  const handleDeleteItem = (id: string) => {
    showModal(
      '삭제 확인',
      '이 히스토리를 삭제하시겠습니까?',
      async () => {
        await deleteFromHistory(id);
      }
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    showModal(
      '삭제 확인',
      `선택한 ${selectedIds.length}개의 히스토리를 삭제하시겠습니까?`,
      async () => {
        await deleteMultiple(selectedIds);
        setSelectionMode(false);
        clearSelection();
      }
    );
  };

  const handleUpdateAnalysis = async (id: string, updates: Partial<Analysis>) => {
    await updateHistory(id, updates);
    // Refresh current analysis if it's the one being updated
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis({ ...currentAnalysis, ...updates });
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setCurrentAnalysis(null);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    clearSelection();
  };

  const handleSelectAll = () => {
    selectAll();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Actions */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          {/* Left side */}
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => setShowSearch(!showSearch)}
              className="p-2 -ml-2"
            >
              <Ionicons
                name={showSearch ? 'search' : 'search-outline'}
                size={24}
                color="#3B82F6"
              />
            </Pressable>

            <Pressable
              onPress={() => setShowTagFilter(!showTagFilter)}
              className="p-2 relative"
            >
              <Ionicons
                name={showTagFilter ? 'pricetags' : 'pricetags-outline'}
                size={24}
                color="#3B82F6"
              />
              {filters.selectedTags.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-xs font-bold text-white">
                    {filters.selectedTags.length}
                  </Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setShowDateFilter(!showDateFilter)}
              className="p-2 relative"
            >
              <Ionicons
                name={showDateFilter ? 'calendar' : 'calendar-outline'}
                size={24}
                color="#3B82F6"
              />
              {(filters.dateRange.startDate || filters.dateRange.endDate) && (
                <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setShowTemplateTypeFilter(!showTemplateTypeFilter)}
              className="p-2 relative"
            >
              <Ionicons
                name={showTemplateTypeFilter ? 'apps' : 'apps-outline'}
                size={24}
                color="#3B82F6"
              />
              {filters.selectedCategories.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-xs font-bold text-white">
                    {filters.selectedCategories.length}
                  </Text>
                </View>
              )}
            </Pressable>

            {selectionMode && (
              <Pressable onPress={handleSelectAll} className="p-2">
                <Text className="text-blue-600 font-semibold">전체 선택</Text>
              </Pressable>
            )}
          </View>

          {/* Right side */}
          <View className="flex-row items-center gap-3">
            {selectionMode ? (
              <>
                <Text className="text-gray-600">
                  {selectedIds.length}개 선택
                </Text>
                <Pressable
                  onPress={handleDeleteSelected}
                  disabled={selectedIds.length === 0}
                  className="p-2"
                >
                  <Ionicons
                    name="trash"
                    size={24}
                    color={selectedIds.length > 0 ? '#EF4444' : '#D1D5DB'}
                  />
                </Pressable>
                <Pressable onPress={toggleSelectionMode} className="p-2">
                  <Text className="text-blue-600 font-semibold">취소</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={() => setShowSortOptions(!showSortOptions)}
                  className="p-2 relative"
                >
                  <Ionicons
                    name={
                      filters.sortOrder === 'asc'
                        ? 'arrow-up-circle-outline'
                        : 'arrow-down-circle-outline'
                    }
                    size={24}
                    color="#3B82F6"
                  />
                  {showSortOptions && (
                    <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-2 h-2" />
                  )}
                </Pressable>
                <Pressable
                  onPress={toggleSelectionMode}
                  disabled={analyses.length === 0}
                  className="p-2 -mr-2"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color={analyses.length > 0 ? '#3B82F6' : '#D1D5DB'}
                  />
                </Pressable>
              </>
            )}
          </View>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View className="mt-3">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="템플릿 또는 메모 검색..."
                value={filters.searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-2 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
              {filters.searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Tag Filter */}
      {showTagFilter && (
        <View className="bg-white border-b border-gray-200">
          <TagFilter
            selectedTags={filters.selectedTags}
            onTagsChange={setSelectedTags}
          />
        </View>
      )}

      {/* Date Range Filter */}
      {showDateFilter && (
        <View className="bg-white border-b border-gray-200">
          <DateRangeFilter
            startDate={filters.dateRange.startDate}
            endDate={filters.dateRange.endDate}
            onDateRangeChange={setDateRange}
          />
        </View>
      )}

      {/* Sort Options */}
      {showSortOptions && (
        <View className="bg-white border-b border-gray-200">
          <SortOptions
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortByChange={setSortBy}
            onSortOrderChange={setSortOrder}
          />
        </View>
      )}

      {/* Template Type Filter */}
      {showTemplateTypeFilter && (
        <View className="bg-white border-b border-gray-200">
          <TemplateTypeFilter
            selectedCategories={filters.selectedCategories}
            onCategoriesChange={setSelectedCategories}
          />
        </View>
      )}

      {/* History List */}
      <HistoryList
        analyses={filteredAnalyses}
        loading={loading}
        onRefresh={loadAnalyses}
        onItemPress={handleItemPress}
        onItemDelete={handleDeleteItem}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelection}
        showCheckbox={selectionMode}
        emptyMessage={
          filters.searchQuery ||
          filters.selectedTags.length > 0 ||
          filters.selectedCategories.length > 0 ||
          filters.dateRange.startDate ||
          filters.dateRange.endDate
            ? '필터 조건에 맞는 히스토리가 없습니다'
            : '저장된 히스토리가 없습니다'
        }
      />

      {/* Detail Modal */}
      <Modal
        visible={showDetail && currentAnalysis !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseDetail}
      >
        {currentAnalysis && (
          <HistoryDetail
            analysis={currentAnalysis}
            onClose={handleCloseDetail}
            onUpdate={handleUpdateAnalysis}
            onDelete={handleDeleteItem}
          />
        )}
      </Modal>
    </View>
  );
}
