import express from 'express';

const router = express.Router();

/**
 * 系统提示词：让模型扮演塔罗解牌师
 */
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

/**
 * POST /api/interpret
 * 流式返回 AI 解读（SSE 风格：每行 data: {delta: "..."}）
 */
router.post('/', async (req, res) => {
  const { question, spreadName, cardContext, apiConfig } = (req.body || {}) as InterpretBody;

  // 优先使用管理员前端配置的API密钥
  const apiKey = apiConfig?.apiKey || process.env.LLM_API_KEY;
  const baseURL = apiConfig?.baseUrl || process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
  const model = apiConfig?.model || process.env.LLM_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(503);
    res.write('data: ' + JSON.stringify({ error: 'AI 解读未配置：服务器未设置 LLM_API_KEY，请在 .env 中配置后使用。当前仍可查看预设牌意。' }) + '\n\n');
    res.end();
    return;
  }

  const userContent = `【问卜者的问题】${question?.trim() ? question.trim() : '（未提出具体问题，请做通用解读）'}

【牌阵类型】${spreadName || '自由抽牌'}

【抽到的牌】
${cardContext || '（无牌面信息）'}

请基于以上信息给出解读。`;

  // 设置 SSE 流式响应头
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

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
      res.write('data: ' + JSON.stringify({ error: `AI 服务返回错误（${upstream.status}）：${errText.slice(0, 200)}` }) + '\n\n');
      res.end();
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
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            res.write('data: ' + JSON.stringify({ delta }) + '\n\n');
          }
        } catch {
          // 忽略解析错误
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write('data: ' + JSON.stringify({ error: 'AI 解读服务异常，请稍后重试。' }) + '\n\n');
    res.end();
  }
});

export default router;
