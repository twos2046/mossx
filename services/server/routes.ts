import type { ApiResponse, DanmeiContent, DanmeiImageKeywords, DanmeiKeywords, DanmeiStyle } from "../../types.js";
import { huaYunPaint, spiritInspiration, wenMoWrite } from "./geminiController.js";

const createResponse = <T>(data: T | null, success = true, error?: string, status = 200): ApiResponse<T> => ({
  success,
  data,
  error,
  status,
});

export async function handleGenerateText(body: any): Promise<ApiResponse<DanmeiContent>> {
  try {
    const { topic, style, keywords } = body as {
      topic: string;
      style: DanmeiStyle;
      keywords?: DanmeiKeywords;
    };
    const data = await wenMoWrite(topic, style, keywords);
    return createResponse<DanmeiContent>(data);
  } catch (error: any) {
    const message = error?.message || "文墨落笔受阻，请稍后再试";
    return createResponse<DanmeiContent>(null, false, message, 500);
  }
}

export async function handleGenerateImage(body: any): Promise<ApiResponse<DanmeiContent>> {
  try {
    const { prompt, keywords } = body as { prompt: string; keywords?: DanmeiImageKeywords };
    const imageUrl = await huaYunPaint(prompt, keywords);
    return createResponse<DanmeiContent>({ imageUrl, description: prompt });
  } catch (error: any) {
    const message = error?.message || "画韵暂时无法提笔，请稍后再试";
    return createResponse<DanmeiContent>(null, false, message, 500);
  }
}

export async function handleGenerateInspiration(): Promise<ApiResponse<DanmeiContent>> {
  try {
    const data = await spiritInspiration();
    return createResponse<DanmeiContent>(data);
  } catch (error: any) {
    const message = error?.message || "灵感暂未降临，请稍后再试";
    return createResponse<DanmeiContent>(null, false, message, 500);
  }
}
