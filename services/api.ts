
import { wenMoWrite, huaYunPaint, spiritInspiration } from './geminiService';
import { 
  ApiResponse, 
  DanmeiContent, 
  DanmeiStyle, 
  HistoryItem, 
  CollectionItem,
  DanmeiKeywords
} from '../types';

/**
 * This service mimics a backend API interface with unified response formats.
 */

const createResponse = <T>(data: T | null, success: boolean = true, error?: string, status: number = 200): ApiResponse<T> => ({
  success,
  data,
  error,
  status
});

const handleError = (e: any): ApiResponse<any> => {
  console.error("API Error:", e);
  return createResponse(null, false, e.message || "未知错误，请稍后重试", 500);
};

export const api = {
  /**
   * POST /api/generate/text
   */
  async generateText(topic: string, style: DanmeiStyle, keywords?: DanmeiKeywords): Promise<ApiResponse<DanmeiContent>> {
    try {
      const data = await wenMoWrite(topic, style, keywords);
      return createResponse(data);
    } catch (e) {
      return handleError(e);
    }
  },

  /**
   * POST /api/generate/image
   */
  async generateImage(prompt: string): Promise<ApiResponse<DanmeiContent>> {
    try {
      const imageUrl = await huaYunPaint(prompt);
      return createResponse({ imageUrl, description: prompt });
    } catch (e) {
      return handleError(e);
    }
  },

  /**
   * POST /api/generate/inspiration
   */
  async generateInspiration(): Promise<ApiResponse<DanmeiContent>> {
    try {
      const data = await spiritInspiration();
      return createResponse(data);
    } catch (e) {
      return handleError(e);
    }
  },

  /**
   * GET /api/user/history
   */
  async getUserHistory(): Promise<ApiResponse<HistoryItem[]>> {
    try {
      const saved = localStorage.getItem('danmei_app_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return createResponse(parsed.history || []);
      }
      return createResponse([]);
    } catch (e) {
      return handleError(e);
    }
  },

  /**
   * POST /api/user/favorite
   */
  async toggleFavorite(item: HistoryItem): Promise<ApiResponse<CollectionItem[]>> {
    try {
      const saved = localStorage.getItem('danmei_app_state');
      let collections: CollectionItem[] = [];
      if (saved) {
        collections = JSON.parse(saved).collections || [];
      }

      const index = collections.findIndex(c => c.id === item.id);
      if (index > -1) {
        collections.splice(index, 1);
      } else {
        collections.unshift({ ...item, collectedAt: Date.now() });
      }

      return createResponse(collections);
    } catch (e) {
      return handleError(e);
    }
  }
};
