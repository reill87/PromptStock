import { View, ViewProps, Pressable } from 'react-native';
import { ReactNode } from 'react';

export interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  ...props
}: CardProps) {
  // Base styles
  const baseClass = 'bg-white rounded-lg';

  // Variant styles
  const variantClasses = {
    default: 'border border-gray-200',
    elevated: 'shadow-md',
    outlined: 'border-2 border-gray-300',
  };

  // Padding styles
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const cardClass = `${baseClass} ${variantClasses[variant]} ${paddingClasses[padding]}`;

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
}
