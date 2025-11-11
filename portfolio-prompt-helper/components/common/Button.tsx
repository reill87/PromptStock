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

export function Button({
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

  // Base styles
  const baseClass = 'items-center justify-center rounded-lg';

  // Variant styles
  const variantClasses = {
    primary: 'bg-primary active:bg-blue-600',
    secondary: 'bg-secondary active:bg-green-600',
    danger: 'bg-danger active:bg-red-600',
    outline: 'bg-transparent border-2 border-primary active:bg-blue-50',
  };

  // Size styles
  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  // Text color
  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    danger: 'text-white',
    outline: 'text-primary',
  };

  // Text size
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const disabledClass = isDisabled ? 'opacity-50' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClass = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${widthClass}`;
  const textClass = `${textColors[variant]} ${textSizes[size]} font-semibold`;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={buttonClass}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3B82F6' : 'white'} />
      ) : (
        <Text className={textClass}>{title}</Text>
      )}
    </Pressable>
  );
}
