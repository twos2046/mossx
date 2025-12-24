import { spiritInspiration } from './lib/gemini';
import { createResponse, methodNotAllowed } from './lib/responses';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json(methodNotAllowed());
  }

  try {
    const data = await spiritInspiration();
    return res.status(200).json(createResponse(data));
  } catch (error: any) {
    console.error('Inspiration generation error:', error);
    return res
      .status(500)
      .json(
        createResponse(
          null,
          false,
          error?.message || '灵感采集失败，请稍后再试',
          500
        )
      );
  }
}
