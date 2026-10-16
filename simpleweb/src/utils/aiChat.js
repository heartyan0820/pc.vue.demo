/**
 * AI 对话客户端（Chat Completions，OpenAI 兼容协议）
 *
 * DeepSeek / 阿里云百炼 / 百度千帆 用的都是同一套 OpenAI 兼容协议，
 * 区别只在「地址 + 模型名 + 密钥」，这三项全部从后台 /admin/sysconfigs 拉取，
 * 前端不再硬编码任何密钥。
 *
 * 注意：各家接口都不允许浏览器跨域直连，开发环境靠 vite 的通用代理 /ai-proxy 转发
 * （见 vite.config.js）；生产环境必须换成你自己的后端代理。
 */
import request from "./request";

const STATUS_MESSAGES = {
  400: "请求格式错误，请检查参数",
  401: "API Key 无效或已失效",
  402: "账户余额不足，请充值后再试",
  403: "没有该模型的访问权限",
  422: "请求参数不合法",
  429: "请求过于频繁，请稍后重试",
  500: "模型服务端内部错误",
  503: "模型服务繁忙，请稍后重试",
};

/**
 * 把后台 sysconfigs 的一条记录转成可用配置。
 * value 有两种形态：
 *  1) JSON 字符串：{"Model":"...","Url":"...","ApiKey":"...","Temperature":1.0}  ← 可用
 *  2) 普通字符串：如 "AI.DeepSeek.Chat"，指向另一条配置的 key，自身不可用       ← 跳过
 */
export function parseAiConfig(item) {
  let parsed = null;
  try {
    parsed = JSON.parse((item?.value || "").trim());
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") return null;
  if (!parsed.Model || !parsed.Url || !parsed.ApiKey) return null;

  const temperature = Number(parsed.Temperature);
  return {
    id: item.id,
    key: item.key || "",
    name: item.name || item.key || "未命名配置",
    model: String(parsed.Model),
    url: String(parsed.Url),
    apiKey: String(parsed.ApiKey),
    temperature: Number.isFinite(temperature) ? temperature : null,
  };
}

/** 拉取后台 AI 配置列表（keywords=AI），返回可直接使用的配置 */
export async function fetchAiConfigs() {
  const data = await request.get("/admin/sysconfigs/page", {
    params: { pageIndex: 1, pageSize: 50, keywords: "AI" },
  });

  const list = data?.list || data?.data?.list || [];
  return list.map(parseAiConfig).filter(Boolean);
}

/** thinking 是 DeepSeek 独有的参数，发给阿里云/百度会被判为非法参数 */
export function supportsThinking(config) {
  return /api\.deepseek\.com/.test(config?.url || "");
}

export function configHost(config) {
  try {
    return new URL(config.url).hostname;
  } catch {
    return config.url || "";
  }
}

/**
 * 发起一次流式对话。
 * @param {object} options
 * @param {object} options.config 选中的 AI 配置（含 url / apiKey / model）
 * @param {Array<{role:string,content:string}>} options.messages 消息上下文
 * @param {number} [options.temperature] 留空则用配置里自带的 Temperature
 * @param {boolean} options.thinking 是否开启深度思考（仅 DeepSeek 生效）
 * @param {AbortSignal} [options.signal] 用于中断生成
 * @param {(text:string)=>void} [options.onReasoning] 思维链增量
 * @param {(text:string)=>void} [options.onContent] 正文增量
 * @param {(usage:object)=>void} [options.onUsage] token 用量
 */
export async function streamChat(options) {
  const {
    config,
    messages,
    temperature,
    thinking = true,
    signal,
    onReasoning,
    onContent,
    onUsage,
  } = options;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.apiKey}`,
  };

  const body = {
    model: config.model,
    messages,
    stream: true,
    stream_options: { include_usage: true },
  };

  const target = Number.isFinite(temperature) ? temperature : config.temperature;
  if (Number.isFinite(target)) body.temperature = target;

  // 只有 DeepSeek 才认这个字段，其他厂商收到会直接 400
  if (supportsThinking(config) && !thinking) body.thinking = { type: "disabled" };

  const response = await fetch(toRequestUrl(config.url), {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) throw new Error(await buildErrorMessage(response));

  await readSseStream(response, { onReasoning, onContent, onUsage });
}

function toRequestUrl(target) {
  // 开发环境走 vite 通用代理绕开浏览器跨域；生产环境直连（需自备后端代理）
  if (import.meta.env.DEV) return `/ai-proxy?target=${encodeURIComponent(target)}`;
  return target;
}

async function buildErrorMessage(response) {
  let detail = "";
  try {
    const data = await response.json();
    detail = data?.error?.message || data?.message || "";
  } catch {
    detail = "";
  }
  return detail || STATUS_MESSAGES[response.status] || `请求失败（HTTP ${response.status}）`;
}

/** 解析 SSE：逐行读取 `data: {...}`，以 `data: [DONE]` 结束 */
async function readSseStream(response, { onReasoning, onContent, onUsage }) {
  if (!response.body) throw new Error("当前浏览器不支持流式响应");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // 末尾可能是不完整的一行，留到下一轮

    for (const line of lines) {
      const payload = line.trim();
      if (!payload.startsWith("data:")) continue;

      const data = payload.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      try {
        const chunk = JSON.parse(data);
        const delta = chunk?.choices?.[0]?.delta || {};
        if (delta.reasoning_content) onReasoning?.(delta.reasoning_content);
        if (delta.content) onContent?.(delta.content);
        if (chunk?.usage) onUsage?.(chunk.usage);
      } catch {
        // 忽略无法解析的片段，避免整个会话中断
      }
    }
  }
}
