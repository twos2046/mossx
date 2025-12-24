import http from "http";
import fs from "fs";
import path from "path";
import { handleGenerateImage, handleGenerateInspiration, handleGenerateText } from "./routes.js";

const distPath = path.resolve(process.cwd(), "dist");

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const getContentType = (filePath: string) => {
  const ext = path.extname(filePath);
  switch (ext) {
    case ".html":
      return "text/html";
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".webp":
      return "image/webp";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
};

const sendJson = (res: http.ServerResponse, status: number, payload: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json", ...defaultHeaders });
  res.end(JSON.stringify(payload));
};

const readRequestBody = async (req: http.IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
};

const serveStaticFile = (res: http.ServerResponse, pathname: string) => {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(distPath, decodeURIComponent(safePath));

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath), ...defaultHeaders });
    stream.pipe(res);
    return;
  }

  const fallback = path.join(distPath, "index.html");
  if (fs.existsSync(fallback)) {
    const stream = fs.createReadStream(fallback);
    res.writeHead(200, { "Content-Type": "text/html", ...defaultHeaders });
    stream.pipe(res);
    return;
  }

  res.writeHead(404, { ...defaultHeaders });
  res.end("Not Found");
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { success: false, data: null, status: 400, error: "Bad Request" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, defaultHeaders);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname.startsWith("/api/")) {
    try {
      const body = await readRequestBody(req);
      switch (url.pathname) {
        case "/api/generate/text": {
          const payload = await handleGenerateText(body);
          sendJson(res, payload.status, payload);
          break;
        }
        case "/api/generate/image": {
          const payload = await handleGenerateImage(body);
          sendJson(res, payload.status, payload);
          break;
        }
        case "/api/generate/inspiration": {
          const payload = await handleGenerateInspiration();
          sendJson(res, payload.status, payload);
          break;
        }
        default: {
          sendJson(res, 404, { success: false, data: null, status: 404, error: "API route not found" });
        }
      }
    } catch (error: any) {
      const message = error?.message || "服务器处理请求时出现错误";
      sendJson(res, 500, { success: false, data: null, status: 500, error: message });
    }
    return;
  }

  if (fs.existsSync(distPath)) {
    serveStaticFile(res, url.pathname);
  } else {
    res.writeHead(404, defaultHeaders);
    res.end("Assets not built yet.");
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 8080;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
