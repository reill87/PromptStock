/**
 * useLLMClient Hook
 * LLM 클라이언트를 사용하여 프롬프트 실행
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import { LLMClientFactory } from '@/services/llm/LLMClientFactory';
import { LLMClient, LLMResponse, LLMGenerationProgress, LLMMode } from '@/types/llm';
import { useSettingsStore } from '@/store/settingsStore';
import { useModelStore } from '@/store/modelStore';

export function useLLMClient() {
  const llmConfig = useSettingsStore((state) => state.llmConfig);
  const installedModel = useModelStore((state) => state.installedModel);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<LLMGenerationProgress | null>(null);
  const clientRef = useRef<LLMClient | null>(null);

  /**
   * 프롬프트 실행
   */
  const executeAnalysis = useCallback(
    async (prompt: string, images?: string[]): Promise<LLMResponse> => {
      setIsProcessing(true);
      setProgress(null);

      try {
        const mode = llmConfig.mode;

        // 클라이언트 생성 옵션
        const options =
          mode === 'local' && installedModel
            ? {
                modelPath: installedModel.files.modelPath,
                mmprojPath: installedModel.files.mmprojPath,
                maxTokens: llmConfig.localConfig?.maxTokens,
                temperature: llmConfig.localConfig?.temperature,
                contextSize: llmConfig.localConfig?.contextSize,
              }
            : undefined;

        // Factory로 클라이언트 생성
        const client = LLMClientFactory.create(
          mode,
          options,
          (progressUpdate) => {
            setProgress(progressUpdate);
          }
        );

        clientRef.current = client;

        // 초기화 (필요한 경우)
        if (!client.isReady()) {
          await client.initialize();
        }

        // 실행
        const response = await client.generate(prompt, images);

        // 정리
        await client.cleanup();
        clientRef.current = null;

        return response;
      } catch (error: any) {
        // 에러 발생 시에도 정리
        if (clientRef.current) {
          try {
            await clientRef.current.cleanup();
          } catch (cleanupError) {
            console.error('Cleanup error:', cleanupError);
          }
          clientRef.current = null;
        }

        throw error;
      } finally {
        setIsProcessing(false);
        setProgress(null);
      }
    },
    [llmConfig, installedModel]
  );

  /**
   * 진행 중인 작업 취소
   */
  const cancelAnalysis = useCallback(async () => {
    if (clientRef.current && 'stopGeneration' in clientRef.current) {
      try {
        await (clientRef.current as any).stopGeneration();
        await clientRef.current.cleanup();
      } catch (error) {
        console.error('Cancel error:', error);
      } finally {
        clientRef.current = null;
        setIsProcessing(false);
        setProgress(null);
      }
    }
  }, []);

  /**
   * 앱이 백그라운드로 갈 때 자동 정리
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' && clientRef.current) {
        // 백그라운드로 가면 모델 정리
        clientRef.current.cleanup().catch((error) => {
          console.error('Background cleanup error:', error);
        });
        clientRef.current = null;
        setIsProcessing(false);
        setProgress(null);
      }
    });

    return () => subscription.remove();
  }, []);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.cleanup().catch((error) => {
          console.error('Unmount cleanup error:', error);
        });
      }
    };
  }, []);

  return {
    executeAnalysis,
    cancelAnalysis,
    isProcessing,
    progress,
  };
}
