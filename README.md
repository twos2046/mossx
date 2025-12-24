<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ORxRFWuruqQri1on3pZc-gJ0Lqd4pFqy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Add a `.env.local` file to configure models:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here      # 用于 Gemini 模型（默认回退）
   VITE_OPENAI_API_KEY=your_openai_api_key_here      # 启用 OpenAI 兼容接口
   # VITE_OPENAI_BASE_URL=https://api.openai.com/v1  # 如需自定义 OpenAI 兼容网关可覆盖
   ```
   应用会优先使用 OpenAI，如果不可用将自动回退到 Gemini。
3. Run the app:
   `npm run dev`
