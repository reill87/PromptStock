/**
 * OCR Hook
 * 이미지 텍스트 인식을 위한 React Hook
 */

import { useState, useCallback } from 'react';
import { OCRService } from '@/services/ocr/OCRService';
import type { OCRResult, OCRProgress } from '@/types/ocr';

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);

  /**
   * 단일 이미지에서 텍스트 추출
   */
  const extractText = useCallback(async (imageUri: string): Promise<OCRResult> => {
    setIsProcessing(true);
    setProgress({
      stage: 'preparing',
      progress: 0,
      message: '이미지 준비 중...',
    });

    try {
      setProgress({
        stage: 'processing',
        progress: 50,
        message: '텍스트 인식 중...',
      });

      const ocrResult = await OCRService.extractText(imageUri);

      setProgress({
        stage: 'completed',
        progress: 100,
        message: '완료',
      });

      setResult(ocrResult);
      return ocrResult;
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, []);

  /**
   * 여러 이미지에서 텍스트 추출
   */
  const extractTextFromMultiple = useCallback(
    async (imageUris: string[]): Promise<OCRResult[]> => {
      setIsProcessing(true);
      setProgress({
        stage: 'preparing',
        progress: 0,
        message: `${imageUris.length}개 이미지 준비 중...`,
      });

      try {
        const results: OCRResult[] = [];

        for (let i = 0; i < imageUris.length; i++) {
          const progressPercent = ((i + 1) / imageUris.length) * 100;

          setProgress({
            stage: 'processing',
            progress: progressPercent,
            message: `이미지 ${i + 1}/${imageUris.length} 처리 중...`,
          });

          const ocrResult = await OCRService.extractText(imageUris[i]);
          results.push(ocrResult);
        }

        setProgress({
          stage: 'completed',
          progress: 100,
          message: '완료',
        });

        // 마지막 결과를 result에 설정
        if (results.length > 0) {
          // 모든 결과를 합친 결과 생성
          const combinedResult: OCRResult = {
            fullText: results.map((r) => r.fullText).join('\n\n---\n\n'),
            blocks: results.flatMap((r) => r.blocks),
            processingTime: results.reduce((sum, r) => sum + r.processingTime, 0),
            success: results.every((r) => r.success),
          };
          setResult(combinedResult);
        }

        return results;
      } finally {
        setIsProcessing(false);
        setProgress(null);
      }
    },
    []
  );

  /**
   * 상태 초기화
   */
  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(null);
    setResult(null);
  }, []);

  return {
    isProcessing,
    progress,
    result,
    extractText,
    extractTextFromMultiple,
    reset,
  };
}
