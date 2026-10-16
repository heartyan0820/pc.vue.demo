import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { defineConfig } from "vite";

// 各家大模型接口都不允许浏览器跨域直连，开发环境统一走这个通用代理：
// 前端请求 /ai-proxy?target=<厂商完整URL>，由 dev server 转发。
// 白名单是防 SSRF 的：dev server 监听 0.0.0.0，不能变成开放代理。
// 接新厂商时，把域名加进这个集合即可。
const AI_PROXY_ALLOWED_HOSTS = new Set([
  "api.deepseek.com",
  "dashscope.aliyuncs.com",
  "qianfan.baidubce.com",
]);

const SKIP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "origin",
  "referer",
  "accept-encoding",
  "user-agent",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
]);

const SKIP_RESPONSE_HEADERS = new Set([
  "transfer-encoding",
  "connection",
  "content-encoding",
  "content-length",
]);

async function forwardToModel(req, res) {
  const target = new URL(req.url, "http://localhost").searchParams.get("target");

  let url;
  try {
    url = new URL(target || "");
  } catch {
    res.statusCode = 400;
    res.end("ai-proxy: 缺少或非法 target 参数");
    return;
  }

  if (url.protocol !== "https:" || !AI_PROXY_ALLOWED_HOSTS.has(url.hostname)) {
    res.statusCode = 403;
    res.end(`ai-proxy: 域名不在白名单：${[...AI_PROXY_ALLOWED_HOSTS].join(", ")}`);
    return;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);

  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (SKIP_REQUEST_HEADERS.has(name)) continue;
    headers[name] = Array.isArray(value) ? value.join(", ") : value;
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body: hasBody ? Buffer.concat(chunks) : undefined,
  });

  res.statusCode = upstream.status;
  if (upstream.statusText) res.statusMessage = upstream.statusText;
  upstream.headers.forEach((value, name) => {
    if (!SKIP_RESPONSE_HEADERS.has(name)) res.setHeader(name, value);
  });

  // 流式转发：SSE 要边收边推，不能等全部结束再一次性写
  if (upstream.body) {
    Readable.fromWeb(upstream.body).pipe(res);
  } else {
    res.end();
  }
}

function aiProxy() {
  return {
    name: "ai-proxy",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/ai-proxy")) return next();
        forwardToModel(req, res).catch((error) => {
          res.statusCode = 502;
          res.end(`ai-proxy: ${error.message}`);
        });
      });
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [vue(), aiProxy()],
  resolve: {
    alias: {
      "@assets": fileURLToPath(new URL("../assets", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  publicDir: "../public",
  base: command === "build" ? "/pc.vue.demo/" : "/",
  server: {
    host: "0.0.0.0",
    port: 5176,
    strictPort: true,
  },
}));
