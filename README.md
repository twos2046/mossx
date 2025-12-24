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
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

This project is ready for Vercel’s static build output plus Serverless Functions (under `/api`) so the Gemini API key stays on the server.

1. Install the Vercel CLI and link the project:
   `npm install -g vercel && vercel link`
2. Set your production environment variable (do the same for Preview if needed):
   `vercel env add GEMINI_API_KEY`
3. (Optional) When running the Vite dev server instead of `vercel dev`, point API calls to a deployed backend:
   `VITE_API_BASE_URL=https://<your-deployment>.vercel.app`
4. Develop locally with both the frontend and functions via:
   `vercel dev`
5. Deploy:
   `vercel --prod`

The build output directory is `dist` and Serverless Functions run on Node.js 22 as configured in `vercel.json`.
