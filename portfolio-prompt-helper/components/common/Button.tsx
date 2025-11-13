import React, { memo, useMemo } from 'react';
import { Pressable, Text, ActivityIndicator, PressableProps } from 'react-native';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button = memo(function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClass = useMemo(() => {
    const baseClass = 'items-center justify-center rounded-lg';

    const variantClasses = {
      primary: 'bg-primary active:bg-blue-600',
      secondary: 'bg-secondary active:bg-green-600',
      danger: 'bg-danger active:bg-red-600',
      outline: 'bg-transparent border-2 border-primary active:bg-blue-50',
    };

    const sizeClasses = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };

    const disabledClass = isDisabled ? 'opacity-50' : '';
    const widthClass = fullWidth ? 'w-full' : '';

    return `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${widthClass}`;
  }, [variant, size, isDisabled, fullWidth]);

  const textClass = useMemo(() => {
    const textColors = {
      primary: 'text-white',
      secondary: 'text-white',
      danger: 'text-white',
      outline: 'text-primary',
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return `${textColors[variant]} ${textSizes[size]} font-semibold`;
  }, [variant, size]);

  const indicatorColor = useMemo(
    () => (variant === 'outline' ? '#3B82F6' : 'white'),
    [variant]
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={buttonClass}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text className={textClass}>{title}</Text>
      )}
    </Pressable>
  );
});
