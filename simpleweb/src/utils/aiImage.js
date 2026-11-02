/**
 * AI 图片生成客户端（火山方舟 Seedream / 即梦 4.0）
 *
 * 接口：POST https://ark.cn-beijing.volces.com/api/v3/images/generations
 * 协议：Authorization: Bearer <ARK_API_KEY>，body 为 { model, prompt, size, ... }
 *
 * 与 aiChat.js 一样：地址 / 模型名 / 密钥优先取后台 sysconfigs 里的配置，
 * 开发环境走 vite 通用代理 /ai-proxy 绕开跨域，生产环境直连（需自备后端代理）。
 */
import { fetchAiConfigs } from "./aiChat";

export const DEFAULT_IMAGE_URL =
  "https://ark.cn-beijing.volces.com/api/v3/images/generations";
// 即梦 4.0 = Seedream 4.0
export const DEFAULT_IMAGE_MODEL = "doubao-seedream-4-0-250828";

const STATUS_MESSAGES = {
  400: "请求格式错误，请检查提示词与尺寸",
  401: "API Key 无效或已失效",
  403: "没有该模型的访问权限，请先在方舟控制台开通即梦 4.0",
  404: "模型不存在，请检查模型名是否正确",
  429: "请求过于频繁或额度不足，请稍后重试",
  500: "模型服务端内部错误",
  503: "模型服务繁忙，请稍后重试",
};

// 后台配置里哪些算"图片生成"配置：模型名命中即梦/Seedream 系列，或地址是图片生成路径
const IMAGE_MODEL_PATTERNS = [/seedream/i, /即梦/, /image/i, /t2i/i, /flux/i];

/** 该配置是否用于图片生成 */
export function isImageConfig(config) {
  const model = config?.model || "";
  const url = config?.url || "";
  return (
    IMAGE_MODEL_PATTERNS.some((pattern) => pattern.test(model)) ||
    /images\/generations/i.test(url)
  );
}

/** 从后台配置里挑出图片生成配置；后台没有时返回空数组，由页面回退到默认配置 */
export async function fetchImageConfigs() {
  const list = await fetchAiConfigs();
  return list.filter(isImageConfig);
}

/** 尺寸可选值：Seedream 4.0 支持 1K / 2K / 4K，也可传具体宽高（如 2048x2048） */
export const IMAGE_SIZES = [
  { label: "1K（1024×1024，更快）", value: "1K" },
  { label: "2K（推荐）", value: "2K" },
  { label: "4K（更清晰，更慢）", value: "4K" },
];

/**
 * 生成图片。
 * @param {object} options
 * @param {{url?:string, model?:string, apiKey:string}} options.config 生效配置
 * @param {string} options.prompt 提示词
 * @param {string} [options.size] 尺寸，默认 2K
 * @param {boolean} [options.watermark] 是否加 AI 生成水印
 * @param {AbortSignal} [options.signal] 中断信号
 * @returns {Promise<Array<{url:string}>>} 图片地址列表（有效期 24 小时）
 */
export async function generateImage({
  config,
  prompt,
  size = "2K",
  watermark = false,
  signal,
}) {
  const body = {
    model: config.model || DEFAULT_IMAGE_MODEL,
    prompt,
    size,
    // 直接要 URL，避免 base64 撑爆内存；b64_json 也可，但体积大很多
    response_format: "url",
    watermark,
  };

  const response = await fetch(toRequestUrl(config.url || DEFAULT_IMAGE_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) throw new Error(await buildErrorMessage(response));

  const data = await response.json();
  const images = (data?.data || [])
    .map((item) => ({ url: item?.url || toDataUrl(item?.b64_json) }))
    .filter((item) => item.url);

  if (!images.length) {
    throw new Error("接口没有返回图片，请确认模型名是图片生成模型（如 doubao-seedream-4-0-250828）");
  }
  return images;
}

function toDataUrl(b64) {
  if (!b64) return "";
  return b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}`;
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
