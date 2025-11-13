import React, { memo, useMemo } from 'react';
import { View, ViewProps, Pressable } from 'react-native';
import { ReactNode } from 'react';

export interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

export const Card = memo(function Card({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  ...props
}: CardProps) {
  const cardClass = useMemo(() => {
    const baseClass = 'bg-white rounded-lg';

    const variantClasses = {
      default: 'border border-gray-200',
      elevated: 'shadow-md',
      outlined: 'border-2 border-gray-300',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };

    return `${baseClass} ${variantClasses[variant]} ${paddingClasses[padding]}`;
  }, [variant, padding]);

  // If onPress is provided, use Pressable
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${cardClass} active:opacity-80`}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={cardClass} {...props}>
      {children}
    </View>
  );
});
