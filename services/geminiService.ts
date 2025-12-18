
import { GoogleGenAI, Type } from "@google/genai";
import { DanmeiStyle, DanmeiContent, DanmeiKeywords } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function wenMoWrite(topic: string, style: DanmeiStyle, keywords?: DanmeiKeywords): Promise<DanmeiContent> {
  const systemInstruction = `你是耽美文学创作专家【文墨】，一位优雅的银发紫眸AI耽美作家。你擅长创作辞藻优美、情感张力极强的耽美文学。
  
  请根据用户提供的关键词组合生成符合耽美美学的高质量文本内容。
  
  创作准则：
  1. 文字风格：温柔细腻，富有画面感。
  2. 情感表达：真挚动人，避免过于直白，注重意境。
  3. 人物塑造：立体饱满，有成长轨迹。
  4. 情节推进：自然流畅，符合逻辑。
  
  返回格式：JSON。`;

  let prompt = `请创作一篇耽美文学作品。
  主题：${topic || '未指定主题，请自由发挥美学想象'}
  风格偏好：${style}
  
  【具体参数设定】
  攻方设定：${keywords?.seme || '默认强攻'}
  受方设定：${keywords?.uke || '默认美人受'}
  时代背景：${keywords?.era || '默认都市'}
  关系设定：${keywords?.relationship || '默认宿命牵绊'}
  主要情节：${keywords?.plot || '默认治愈'}
  篇幅字数：${keywords?.length || '短篇'}
  
  请提供：
  1. 唯美标题
  2. 一段极具美感的正文试读（约500-800字）
  3. CP设定与关系描述
  4. 3个引人入胜的剧情钩子
  5. 相关的人设与氛围标签`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          body: { type: Type.STRING, description: "唯美试读段落" },
          pairings: { type: Type.STRING, description: "CP设定" },
          plotHooks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3个核心剧情钩子" },
          traits: { type: Type.ARRAY, items: { type: Type.STRING }, description: "人设标签" }
        },
        required: ["title", "body", "pairings", "plotHooks", "traits"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function huaYunPaint(promptText: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `Aesthetic Danmei style illustration: ${promptText}. soft lighting, dreamy atmosphere, elegant characters, high detail, masterpiece, lavender and mint color palette.` }
      ]
    },
    config: {
      imageConfig: { aspectRatio: "3:4" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("画韵今日笔墨已干，请稍后再试。");
}

export async function spiritInspiration(): Promise<DanmeiContent> {
  const prompt = "为我提供一个耽美创作灵感，包括：一个反差人设对子，一个修罗场梗。";
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pairings: { type: Type.STRING },
          description: { type: Type.STRING },
          traits: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["pairings", "description", "traits"]
      }
    }
  });
  return JSON.parse(response.text);
}
