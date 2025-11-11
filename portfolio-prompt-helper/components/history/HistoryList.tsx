import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Analysis } from '@/types';
import { HistoryItem } from './HistoryItem';

export interface HistoryListProps {
  analyses: Analysis[];
  loading?: boolean;
  onRefresh?: () => void;
  onItemPress: (analysis: Analysis) => void;
  onItemDelete: (id: string) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  showCheckbox?: boolean;
  emptyMessage?: string;
}

export function HistoryList({
  analyses,
  loading = false,
  onRefresh,
  onItemPress,
  onItemDelete,
  selectedIds = [],
  onToggleSelect,
  showCheckbox = false,
  emptyMessage = '저장된 히스토리가 없습니다',
}: HistoryListProps) {
  // Empty state
  if (!loading && analyses.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Text className="text-6xl mb-4">📋</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          {emptyMessage}
        </Text>
        <Text className="text-sm text-gray-500 text-center px-8">
          프롬프트를 생성하고 저장하면{'\n'}여기에 표시됩니다
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={analyses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <HistoryItem
          analysis={item}
          onPress={onItemPress}
          onDelete={onItemDelete}
          selected={selectedIds.includes(item.id)}
          onToggleSelect={onToggleSelect}
          showCheckbox={showCheckbox}
        />
      )}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 32,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        ) : undefined
      }
      ListFooterComponent={
        loading && analyses.length > 0 ? (
          <View className="py-4">
            <ActivityIndicator size="small" color="#3B82F6" />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}
