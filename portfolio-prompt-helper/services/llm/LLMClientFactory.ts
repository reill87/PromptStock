/**
 * LLMClientFactory
 * LLM 클라이언트를 생성하는 팩토리 클래스
 * Factory 패턴을 사용하여 적절한 LLM 클라이언트 반환
 */

import { LLMClient, LLMMode, LLMGenerationProgress } from '@/types/llm';
import { ClipboardClient } from './ClipboardClient';
import { LocalLLMClient } from './LocalLLMClient';

/**
 * LLM 클라이언트 팩토리
 */
export class LLMClientFactory {
  /**
   * LLM 모드에 따라 적절한 클라이언트 생성
   *
   * @param mode LLM 모드 ('clipboard' | 'local')
   * @param options 추가 옵션
   * @param progressCallback 진행률 콜백 (로컬 모드에서만 사용)
   * @returns LLMClient 인스턴스
   *
   * @example
   * // 클립보드 모드
   * const client = LLMClientFactory.create('clipboard');
   * await client.generate(prompt);
   *
   * @example
   * // 로컬 모드
   * const client = LLMClientFactory.create('local', {
   *   modelPath: '/path/to/model.gguf',
   *   mmprojPath: '/path/to/mmproj.gguf',
   * }, (progress) => {
   *   console.log(`Progress: ${progress.progress}%`);
   * });
   */
  static create(
    mode: LLMMode,
    options?: {
      // 로컬 모드 옵션
      modelPath?: string;
      mmprojPath?: string;
      maxTokens?: number;
      temperature?: number;
      contextSize?: number;
    },
    progressCallback?: (progress: LLMGenerationProgress) => void
  ): LLMClient {
    switch (mode) {
      case 'clipboard':
        return new ClipboardClient();

      case 'local':
        if (!options?.modelPath || !options?.mmprojPath) {
          throw new Error('로컬 모드에는 modelPath와 mmprojPath가 필요합니다');
        }

        return new LocalLLMClient(
          options.modelPath,
          options.mmprojPath,
          {
            maxTokens: options.maxTokens,
            temperature: options.temperature,
            contextSize: options.contextSize,
          },
          progressCallback
        );

      default:
        throw new Error(`알 수 없는 LLM 모드: ${mode}`);
    }
  }

  /**
   * 설정과 모델 스토어를 기반으로 클라이언트 생성
   * 실제 앱에서는 이 메서드를 주로 사용
   *
   * Phase 1에서는 스텁으로 남겨두고, Phase 5에서 Settings/Model Store와 통합
   */
  static createFromStore(
    progressCallback?: (progress: LLMGenerationProgress) => void
  ): LLMClient {
    // TODO: Phase 5에서 구현
    // const settings = useSettingsStore.getState();
    // const modelStore = useModelStore.getState();
    //
    // const mode = settings.llmConfig.mode;
    //
    // if (mode === 'local') {
    //   const installedModel = modelStore.installedModel;
    //   if (!installedModel) {
    //     throw new Error('로컬 모델이 설치되지 않았습니다');
    //   }
    //
    //   return LLMClientFactory.create(
    //     'local',
    //     {
    //       modelPath: installedModel.files.modelPath,
    //       mmprojPath: installedModel.files.mmprojPath,
    //       maxTokens: settings.llmConfig.localConfig?.maxTokens,
    //       temperature: settings.llmConfig.localConfig?.temperature,
    //       contextSize: settings.llmConfig.localConfig?.contextSize,
    //     },
    //     progressCallback
    //   );
    // }
    //
    // return LLMClientFactory.create('clipboard');

    throw new Error('Phase 5에서 구현 예정: Store 기반 클라이언트 생성');
  }
}
