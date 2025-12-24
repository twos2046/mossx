
import { wenMoWrite, huaYunPaint, spiritInspiration } from './geminiService';
import { 
  ApiResponse, 
  DanmeiContent, 
  DanmeiStyle, 
  HistoryItem, 
  CollectionItem,
  DanmeiKeywords,
  DanmeiImageKeywords
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
  async generateImage(prompt: string, keywords?: DanmeiImageKeywords): Promise<ApiResponse<DanmeiContent>> {
    try {
      const imageUrl = await huaYunPaint(prompt, keywords);
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
   * 完善收藏逻辑：增加 10 条收藏上限限制
   */
  async toggleFavorite(item: HistoryItem): Promise<ApiResponse<CollectionItem[]>> {
    try {
      const saved = localStorage.getItem('danmei_app_state');
      let collections: CollectionItem[] = [];
      if (saved) {
        try {
          collections = JSON.parse(saved).collections || [];
        } catch (e) {
          collections = [];
        }
      }

      const index = collections.findIndex(c => c.id === item.id);
      if (index > -1) {
        // 如果已存在，则取消收藏
        collections.splice(index, 1);
      } else {
        // 如果不存在，则添加收藏并保持在 10 条以内
        collections.unshift({ ...item, collectedAt: Date.now() });
        if (collections.length > 10) {
          collections = collections.slice(0, 10);
        }
      }

      // 同步回本地存储，避免刷新后收藏状态丢失
      let savedState = {};
      if (saved) {
        try {
          savedState = JSON.parse(saved);
        } catch {
          savedState = {};
        }
      }
      localStorage.setItem('danmei_app_state', JSON.stringify({
        ...savedState,
        collections
      }));

      return createResponse(collections);
    } catch (e) {
      return handleError(e);
    }
  }
};
