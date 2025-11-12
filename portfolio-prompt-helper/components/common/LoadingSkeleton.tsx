import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function LoadingSkeleton({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}: LoadingSkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// History Item Skeleton
export function HistoryItemSkeleton() {
  return (
    <View className="bg-white dark:bg-dark-bg-primary rounded-lg p-4 mb-3 shadow-md">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <LoadingSkeleton width="60%" height={20} borderRadius={4} />
          <View className="mt-2">
            <LoadingSkeleton width="40%" height={14} borderRadius={4} />
          </View>
        </View>
      </View>

      <View className="flex-row gap-2 mb-2 mt-2">
        <LoadingSkeleton width={60} height={24} borderRadius={12} />
        <LoadingSkeleton width={70} height={24} borderRadius={12} />
        <LoadingSkeleton width={50} height={24} borderRadius={12} />
      </View>

      <LoadingSkeleton width="100%" height={16} borderRadius={4} />

      <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
        <LoadingSkeleton width={80} height={12} borderRadius={4} />
      </View>
    </View>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <View className="bg-white dark:bg-dark-bg-primary rounded-lg p-4 mb-3">
      <LoadingSkeleton width="100%" height={120} borderRadius={8} />
      <View className="mt-3">
        <LoadingSkeleton width="80%" height={18} borderRadius={4} />
      </View>
      <View className="mt-2">
        <LoadingSkeleton width="60%" height={14} borderRadius={4} />
      </View>
    </View>
  );
}

// List Skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="p-4">
      {Array.from({ length: count }).map((_, index) => (
        <HistoryItemSkeleton key={index} />
      ))}
    </View>
  );
}
