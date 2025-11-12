// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

// Custom error class
export class AppError extends Error {
  type: ErrorType;
  userMessage: string;

  constructor(type: ErrorType, message: string, userMessage?: string) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.userMessage = userMessage || this.getDefaultUserMessage(type);
  }

  private getDefaultUserMessage(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return '네트워크 연결을 확인해주세요.';
      case ErrorType.STORAGE:
        return '데이터 저장 중 오류가 발생했습니다.';
      case ErrorType.VALIDATION:
        return '입력값을 확인해주세요.';
      case ErrorType.PERMISSION:
        return '권한이 필요합니다.';
      default:
        return '오류가 발생했습니다.';
    }
  }
}

// Error handler function
export function handleError(error: unknown): AppError {
  console.error('Error occurred:', error);

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new AppError(ErrorType.NETWORK, error.message);
    }

    // Storage errors
    if (error.message.includes('storage') || error.message.includes('AsyncStorage')) {
      return new AppError(ErrorType.STORAGE, error.message);
    }

    // Permission errors
    if (error.message.includes('permission') || error.message.includes('denied')) {
      return new AppError(ErrorType.PERMISSION, error.message);
    }

    return new AppError(ErrorType.UNKNOWN, error.message);
  }

  return new AppError(
    ErrorType.UNKNOWN,
    String(error),
    '알 수 없는 오류가 발생했습니다.'
  );
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorCallback?: (error: AppError) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const appError = handleError(error);
    if (errorCallback) {
      errorCallback(appError);
    }
    return null;
  }
}

// Retry logic
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError || new Error('Retry failed');
}
