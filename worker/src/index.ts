/**
 * 胡萝卜塔罗 · AI 解读代理（Cloudflare Worker，原生 TS）
 *
 * 路由：
 *   GET  /api/health     健康检查
 *   POST /api/interpret  流式 AI 塔罗解读
 *                        （SSE 风格：每行 data: {"delta":"..."}\n\n，结束 data: [DONE]\n\n）
 *   OPTIONS *            CORS 预检
 *
 * 密钥优先级：请求体 apiConfig（管理后台填写）> Worker 环境变量/密钥 LLM_API_KEY
 * 在 Cloudflare 控制台配置：Workers & Pages → carrot-tarot-api → Settings → Variables and Secrets
 *   LLM_API_KEY  必填（OpenAI 兼容接口密钥）
 *   LLM_BASE_URL 可选（默认 https://api.openai.com/v1）
 *   LLM_MODEL    可选（默认 gpt-4o-mini）
 */

export interface Env {
  LLM_API_KEY?: string;
  LLM_BASE_URL?: string;
  LLM_MODEL?: string;
}

const SYSTEM_PROMPT = `你是一位睿智、神秘而温暖的塔罗解牌师，擅长根据牌阵、每张牌的正逆位与位置含义，结合问卜者的问题，给出深度、有洞察力且富有诗意的解读。

解读要求：
1. 先简要点明整体牌阵的能量与主题。
2. 逐张结合"位置含义 + 牌名 + 正逆位 + 牌意"进行解读，指出牌与牌之间的关联。
3. 最后给出综合性的总结与 actionable 的建议。
4. 语言风格：神秘优雅、中文表达，适度使用意象，但避免空洞玄虚；保持真诚与同理心。
5. 篇幅适中，约 400-700 字。不要使用 Markdown 标题，可用自然分段。`;

interface InterpretBody {
  question?: string;
  spreadName?: string;
  cardContext?: string;
  apiConfig?: {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
  };
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const SSE_HEADERS: Record<string, string> = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-cache',
  ...CORS_HEADERS,
};

// ---- 简易限流（Worker 实例内 best-effort 滑动窗口；Cloudflare 边缘另有 DDoS 防护）----
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateHits.set(ip, hits);
  if (hits.length >= RATE_LIMIT_MAX) return true;
  hits.push(now);
  return false;
}

function clientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS },
  });
}

function sseResponse(stream: ReadableStream<Uint8Array>, status = 200): Response {
  return new Response(stream, { status, headers: SSE_HEADERS });
}

function oneLineStream(line: string): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(line));
      controller.close();
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 健康检查
    if (url.pathname === '/api/health' && request.method === 'GET') {
      return jsonResponse({
        ok: true,
        service: 'carrot-tarot-api',
        aiConfigured: Boolean(env.LLM_API_KEY),
      });
    }

    // 流式解读
    if (url.pathname === '/api/interpret' && request.method === 'POST') {
      if (isRateLimited(clientIp(request))) {
        return jsonResponse({ error: '请求过于频繁，请稍后再试。' }, 429);
      }
      return handleInterpret(request, env);
    }

    return jsonResponse({ error: 'Not Found' }, 404);
  },
};

async function handleInterpret(request: Request, env: Env): Promise<Response> {
  let body: InterpretBody;
  try {
    body = (await request.json()) as InterpretBody;
  } catch {
    return jsonResponse({ error: '请求体格式错误，请发送 JSON。' }, 400);
  }

  // 优先使用管理后台前端配置的密钥，其次使用 Worker 环境变量
  const apiKey = body.apiConfig?.apiKey || env.LLM_API_KEY;
  const baseURL = (
    body.apiConfig?.baseUrl ||
    env.LLM_BASE_URL ||
    'https://api.openai.com/v1'
  ).replace(/\/+$/, '');
  const model = body.apiConfig?.model || env.LLM_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    const stream = oneLineStream(
      'data: ' +
        JSON.stringify({
          error:
            'AI 解读未配置：服务器未设置 LLM_API_KEY，请在 Cloudflare Worker 环境变量中配置后使用。当前仍可查看预设牌意。',
        }) +
        '\n\n',
    );
    return sseResponse(stream, 503);
  }

  // 基本请求校验与长度限制
  const question = (body.question || '').trim().slice(0, 500);
  const spreadName = (body.spreadName || '自由抽牌').slice(0, 50);
  const cardContext = (body.cardContext || '').slice(0, 8000);

  const userContent = `【问卜者的问题】${question || '（未提出具体问题，请做通用解读）'}

【牌阵类型】${spreadName}

【抽到的牌】
${cardContext || '（无牌面信息）'}

请基于以上信息给出解读。`;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const enqueue = (text: string) => controller.enqueue(encoder.encode(text));
      try {
        const upstream = await fetch(`${baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            stream: true,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userContent },
            ],
            temperature: 0.8,
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const errText = await upstream.text().catch(() => '');
          enqueue(
            'data: ' +
              JSON.stringify({
                error: `AI 服务返回错误（${upstream.status}）：${errText.slice(0, 200)}`,
              }) +
              '\n\n',
          );
          return;
        }

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') {
              enqueue('data: [DONE]\n\n');
              return;
            }
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) {
                enqueue('data: ' + JSON.stringify({ delta }) + '\n\n');
              }
            } catch {
              // 忽略无法解析的行
            }
          }
        }

        enqueue('data: [DONE]\n\n');
      } catch {
        enqueue(
          'data: ' + JSON.stringify({ error: 'AI 解读服务异常，请稍后重试。' }) + '\n\n',
        );
      } finally {
        controller.close();
      }
    },
  });

  return sseResponse(stream);
}
