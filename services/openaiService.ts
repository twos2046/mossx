import { DanmeiContent, DanmeiImageKeywords, DanmeiKeywords, DanmeiStyle } from "../types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

const ensureOpenAIConfigured = () => {
  if (!OPENAI_API_KEY) {
    throw new Error("未设置 OpenAI API 密钥，请在 .env.local 中配置 VITE_OPENAI_API_KEY");
  }
};

const parseJsonContent = (content: any): any => {
  if (!content) throw new Error("OpenAI 返回内容为空");

  if (typeof content === "string") {
    return JSON.parse(content);
  }

  if (Array.isArray(content)) {
    const merged = content.map((part) => (typeof part.text === "string" ? part.text : "")).join("");
    if (!merged) throw new Error("OpenAI 未返回文本内容");
    return JSON.parse(merged);
  }

  if (typeof content.text === "string") {
    return JSON.parse(content.text);
  }

  throw new Error("无法解析 OpenAI 返回的内容格式");
};

const buildNarrativePrompt = (topic: string, style: DanmeiStyle, keywords?: DanmeiKeywords) => `你是耽美文学创作专家【文墨】，一位优雅的银发紫眸AI耽美作家。你擅长创作辞藻优美、情感张力极强的耽美文学。

请根据用户提供的关键词组合生成符合耽美美学的高质量文本内容，并以 JSON 返回：
{
  "title": 标题,
  "body": 500-800 字正文,
  "pairings": CP 关系,
  "plotHooks": 3 个剧情钩子数组,
  "traits": 人设标签数组
}

创作准则：
1. 文字风格：温柔细腻，富有画面感。
2. 情感表达：真挚动人，避免过于直白，注重意境。
3. 人物塑造：立体饱满，有成长轨迹。
4. 情节推进：自然流畅，符合逻辑。

主题：${topic || "未指定主题，请自由发挥美学想象"}
风格偏好：${style}
攻方设定：${keywords?.seme || "默认强攻"}
受方设定：${keywords?.uke || "默认美人受"}
时代背景：${keywords?.era || "默认都市"}
关系设定：${keywords?.relationship || "默认宿命牵绊"}
主要情节：${keywords?.plot || "默认治愈"}
篇幅字数：${keywords?.length || "短篇"}`;

export const isOpenAIConfigured = () => Boolean(OPENAI_API_KEY);

export async function inkMuseWrite(topic: string, style: DanmeiStyle, keywords?: DanmeiKeywords): Promise<DanmeiContent> {
  ensureOpenAIConfigured();

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是一位中文耽美文学创作助手，负责输出可直接用于 UI 呈现的结构化内容。",
        },
        {
          role: "user",
          content: buildNarrativePrompt(topic, style, keywords),
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI 文本生成失败");
  }

  const messageContent = data?.choices?.[0]?.message?.content;
  return parseJsonContent(messageContent);
}

export async function auraPaint(promptText: string, keywords?: DanmeiImageKeywords): Promise<string> {
  ensureOpenAIConfigured();

  const visualDescription = `Aesthetic Danmei illustration. Characters: ${keywords?.semeFeature || "elegant"} seme and ${keywords?.ukeFeature || "beautiful"} uke. Composition: ${keywords?.composition || "dynamic interactive pose"}. Lighting: ${keywords?.lighting || "soft cinematic lighting"}. Colors: ${keywords?.colorScheme || "lavender and mint"}. Scene: ${keywords?.scene || "dreamy setting"} at ${keywords?.timeOfDay || "golden hour"}. Atmosphere: ${keywords?.atmosphere || "romantic and dreamy"}. Elements: ${keywords?.elements || "drifting petals, soft sparkles"}. Context: ${promptText}. Style: masterpiece, delicate line art, lush details, emotionally charged gaze.`;

  const response = await fetch(`${OPENAI_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: visualDescription,
      size: "1024x1365",
      response_format: "b64_json",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI 绘画生成失败");
  }

  const base64 = data?.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error("未获取到绘画图像数据");
  }

  return `data:image/png;base64,${base64}`;
}

export async function sparkInspiration(): Promise<DanmeiContent> {
  ensureOpenAIConfigured();

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "你是一位灵感触发器，专注于提供简洁的耽美创作灵感，输出 JSON 便于 UI 展示。",
        },
        {
          role: "user",
          content: "请提供一个耽美创作灵感，包含 pairings（反差人设 CP），description（修罗场或氛围描述），traits（人设与氛围标签数组）。",
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI 灵感生成失败");
  }

  const messageContent = data?.choices?.[0]?.message?.content;
  return parseJsonContent(messageContent);
}
