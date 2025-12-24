
import { huaYunPaint, isGeminiConfigured, spiritInspiration, wenMoWrite } from './geminiService';
import { auraPaint, inkMuseWrite, isOpenAIConfigured, sparkInspiration } from './openaiService';
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

type Provider = 'openai' | 'gemini';

const getProviderOrder = (): Provider[] => {
  const providers: Provider[] = [];
  if (isOpenAIConfigured()) providers.push('openai');
  if (isGeminiConfigured()) providers.push('gemini');
  return providers;
};

const runWithProviders = async <T>(handlers: Record<Provider, () => Promise<T>>): Promise<T> => {
  const providers = getProviderOrder();
  if (!providers.length) {
    throw new Error("未配置任何可用的大模型，请检查 API 密钥设置");
  }

  for (const provider of providers) {
    try {
      return await handlers[provider]();
    } catch (error) {
      if (provider === providers[providers.length - 1]) {
        throw error;
      }
      console.warn(`${provider} 调用失败，尝试切换其他提供方:`, error);
    }
  }

  throw new Error("所有模型提供方均不可用");
};

export const api = {
  /**
   * POST /api/generate/text
   */
  async generateText(topic: string, style: DanmeiStyle, keywords?: DanmeiKeywords): Promise<ApiResponse<DanmeiContent>> {
    try {
      const data = await runWithProviders({
        openai: () => inkMuseWrite(topic, style, keywords),
        gemini: () => wenMoWrite(topic, style, keywords)
      });
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
      const imageUrl = await runWithProviders({
        openai: () => auraPaint(prompt, keywords),
        gemini: () => huaYunPaint(prompt, keywords)
      });
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
      const data = await runWithProviders({
        openai: () => sparkInspiration(),
        gemini: () => spiritInspiration()
      });
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

      return createResponse(collections);
    } catch (e) {
      return handleError(e);
    }
  }
};
