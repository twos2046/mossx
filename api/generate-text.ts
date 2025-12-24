import { wenMoWrite } from './lib/gemini';
import { createResponse, methodNotAllowed } from './lib/responses';
import type { DanmeiStyle, DanmeiKeywords } from '../types';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(methodNotAllowed());
  }

  const { topic, style, keywords } = req.body as {
    topic?: string;
    style?: DanmeiStyle;
    keywords?: DanmeiKeywords;
  };

  try {
    if (!style) {
      return res
        .status(400)
        .json(createResponse(null, false, '缺少必要的创作风格参数', 400));
    }

    const data = await wenMoWrite(topic || '', style, keywords);
    return res.status(200).json(createResponse(data));
  } catch (error: any) {
    console.error('Text generation error:', error);
    return res
      .status(500)
      .json(
        createResponse(
          null,
          false,
          error?.message || '创作失败，请稍后再试',
          500
        )
      );
  }
}
