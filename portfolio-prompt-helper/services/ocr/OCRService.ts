/**
 * OCR 서비스
 * Google ML Kit를 사용한 이미지 텍스트 인식
 */

import TextRecognition from '@react-native-ml-kit/text-recognition';
import type { OCRResult, OCRTextBlock } from '@/types/ocr';

export class OCRService {
  /**
   * 이미지에서 텍스트 추출
   * @param imageUri 이미지 URI (file://, content://, https:// 지원)
   * @returns OCR 결과
   */
  static async extractText(imageUri: string): Promise<OCRResult> {
    const startTime = Date.now();

    try {
      console.log('🔍 Starting OCR for image:', imageUri);

      // ML Kit로 텍스트 인식
      const result = await TextRecognition.recognize(imageUri);

      // 결과 파싱
      const blocks: OCRTextBlock[] = result.blocks.map((block) => ({
        text: block.text,
        confidence: block.recognizedLanguages?.[0]?.confidence ?? 0,
        boundingBox: block.frame
          ? {
              x: block.frame.x,
              y: block.frame.y,
              width: block.frame.width,
              height: block.frame.height,
            }
          : undefined,
      }));

      // 전체 텍스트 합치기
      const fullText = blocks.map((b) => b.text).join('\n');

      const processingTime = Date.now() - startTime;

      console.log(
        `✅ OCR completed in ${processingTime}ms. Extracted ${blocks.length} blocks, ${fullText.length} characters`
      );

      return {
        fullText,
        blocks,
        processingTime,
        success: true,
      };
    } catch (error: any) {
      const processingTime = Date.now() - startTime;

      console.error('❌ OCR failed:', error);

      return {
        fullText: '',
        blocks: [],
        processingTime,
        success: false,
        error: error.message || 'OCR 처리 중 오류 발생',
      };
    }
  }

  /**
   * 여러 이미지에서 텍스트 추출
   * @param imageUris 이미지 URI 배열
   * @returns OCR 결과 배열
   */
  static async extractTextFromMultiple(imageUris: string[]): Promise<OCRResult[]> {
    console.log(`🔍 Starting OCR for ${imageUris.length} images`);

    const results = await Promise.all(imageUris.map((uri) => this.extractText(uri)));

    const successCount = results.filter((r) => r.success).length;
    console.log(`✅ OCR batch completed: ${successCount}/${imageUris.length} succeeded`);

    return results;
  }

  /**
   * OCR 결과를 포트폴리오 데이터 형식으로 파싱
   * 텍스트에서 주식 이름, 비율, 금액 등을 추출 시도
   */
  static parsePortfolioData(ocrResult: OCRResult): {
    rawText: string;
    structuredData?: {
      stocks: Array<{
        name: string;
        percentage?: string;
        value?: string;
      }>;
    };
  } {
    // 기본적으로 원본 텍스트 반환
    // TODO: 향후 포트폴리오 구조 파싱 로직 추가 가능
    return {
      rawText: ocrResult.fullText,
    };
  }
}
