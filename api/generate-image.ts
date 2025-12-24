import { huaYunPaint } from './lib/gemini';
import { createResponse, methodNotAllowed } from './lib/responses';
import type { DanmeiImageKeywords } from '../types';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(methodNotAllowed());
  }

  const { prompt, keywords } = req.body as {
    prompt?: string;
    keywords?: DanmeiImageKeywords;
  };

  try {
    if (!prompt) {
      return res
        .status(400)
        .json(createResponse(null, false, '请描述想要呈现的画面', 400));
    }

    const imageUrl = await huaYunPaint(prompt, keywords);
    return res.status(200).json(createResponse({ imageUrl, description: prompt }));
  } catch (error: any) {
    console.error('Image generation error:', error);
    return res
      .status(500)
      .json(
        createResponse(
          null,
          false,
          error?.message || '绘制失败，请稍后再试',
          500
        )
      );
  }
}
