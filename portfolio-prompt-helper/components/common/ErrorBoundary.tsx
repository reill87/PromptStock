import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 bg-gray-50 dark:bg-dark-bg-secondary p-4 justify-center">
          <View className="bg-white dark:bg-dark-bg-primary rounded-lg p-6 shadow-lg">
            <View className="items-center mb-4">
              <View className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-3">
                <Ionicons name="alert-circle" size={48} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">
                앗! 오류가 발생했습니다
              </Text>
              <Text className="text-sm text-gray-600 dark:text-dark-text-secondary text-center">
                예상치 못한 오류가 발생했습니다.{'\n'}
                앱을 다시 시작해 주세요.
              </Text>
            </View>

            {__DEV__ && this.state.error && (
              <ScrollView
                className="bg-gray-100 dark:bg-dark-bg-tertiary rounded-lg p-3 mb-4"
                style={{ maxHeight: 200 }}
              >
                <Text className="text-xs font-mono text-red-600 dark:text-red-400">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-2">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <Pressable
              onPress={this.handleReset}
              className="bg-primary active:bg-blue-600 rounded-lg py-3 px-6 items-center"
            >
              <Text className="text-white font-semibold text-base">
                다시 시도
              </Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Error fallback component
export function ErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-dark-bg-secondary p-4 justify-center items-center">
      <View className="bg-white dark:bg-dark-bg-primary rounded-lg p-6 shadow-lg max-w-md">
        <View className="items-center mb-4">
          <Ionicons name="warning" size={48} color="#F59E0B" />
          <Text className="text-lg font-bold text-gray-900 dark:text-dark-text-primary mt-3 mb-2">
            문제가 발생했습니다
          </Text>
          <Text className="text-sm text-gray-600 dark:text-dark-text-secondary text-center">
            {error.message || '알 수 없는 오류가 발생했습니다.'}
          </Text>
        </View>

        <Pressable
          onPress={resetError}
          className="bg-primary active:bg-blue-600 rounded-lg py-3 px-6 items-center"
        >
          <Text className="text-white font-semibold">다시 시도</Text>
        </Pressable>
      </View>
    </View>
  );
}
