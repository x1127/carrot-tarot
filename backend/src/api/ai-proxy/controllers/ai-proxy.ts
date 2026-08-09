import { Readable } from 'stream';

/**
 * 默认系统提示词（移植自 tarot-app/api/routes/interpret.ts）
 */
const DEFAULT_SYSTEM_PROMPT = `你是一位睿智、神秘而温暖的塔罗解牌师，擅长根据牌阵、每张牌的正逆位与位置含义，结合问卜者的问题，给出深度、有洞察力且富有诗意的解读。

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
}

export default {
  /**
   * POST /api/ai-proxy/interpret
   * 流式返回 AI 解读（SSE 风格：每行 data: {delta: "..."}）
   * API Key 从 ai-config 单一类型读取，永不出服务器。
   */
  async interpret(ctx: any) {
    const { question, spreadName, cardContext } = (ctx.request.body || {}) as InterpretBody;

    // 最小请求校验：三字段全空视为滥用，直接拒绝，避免无谓的 DB 查询与上游调用
    const hasQuestion = typeof question === 'string' && question.trim().length > 0;
    const hasSpread = typeof spreadName === 'string' && spreadName.trim().length > 0;
    const hasCards = typeof cardContext === 'string' && cardContext.trim().length > 0;
    if (!hasQuestion && !hasSpread && !hasCards) {
      ctx.status = 400;
      ctx.body = {
        error: {
          status: 400,
          name: 'BadRequest',
          message: '请求缺少必要参数：至少需提供 question / spreadName / cardContext 之一。',
        },
      };
      return;
    }

    // 从 Strapi 读取 ai-config（服务器内部访问，绕过公开权限）
    let cfg: any = null;
    try {
      cfg = await strapi.db.query('api::ai-config.ai-config').findOne({});
    } catch {
      // 单一类型尚未创建或读取失败
    }

    const apiKey = cfg?.llmApiKey || process.env.LLM_API_KEY;
    const baseURL = cfg?.llmBaseUrl || process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
    const model = cfg?.llmModel || process.env.LLM_MODEL || 'gpt-4o-mini';
    const systemPrompt = cfg?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    const enableAi = cfg?.enableAi ?? true;

    ctx.set('Content-Type', 'text/plain; charset=utf-8');
    ctx.set('Cache-Control', 'no-cache');
    ctx.set('Connection', 'keep-alive');

    const stream = new Readable({ read() {} });
    ctx.body = stream;

    if (!enableAi || !apiKey) {
      stream.push(
        'data: ' +
          JSON.stringify({
            error: 'AI 解读未配置：请在后台「AI 配置」中填写 API Key 并启用。当前仍可查看预设牌意。',
          }) +
          '\n\n',
      );
      stream.push(null);
      return;
    }

    const userContent = `【问卜者的问题】${question?.trim() ? question.trim() : '（未提出具体问题，请做通用解读）'}

【牌阵类型】${spreadName || '自由抽牌'}

【抽到的牌】
${cardContext || '（无牌面信息）'}

请基于以上信息给出解读。`;

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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
          temperature: 0.8,
        }),
      });

      if (!upstream.ok || !upstream.body) {
        const errText = await upstream.text().catch(() => '');
        stream.push(
          'data: ' +
            JSON.stringify({
              error: `AI 服务返回错误（${upstream.status}）：${errText.slice(0, 200)}`,
            }) +
            '\n\n',
        );
        stream.push(null);
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
            stream.push('data: [DONE]\n\n');
            stream.push(null);
            return;
          }
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              stream.push('data: ' + JSON.stringify({ delta }) + '\n\n');
            }
          } catch {
            // 忽略无法解析的行
          }
        }
      }

      stream.push('data: [DONE]\n\n');
      stream.push(null);
    } catch {
      stream.push(
        'data: ' + JSON.stringify({ error: 'AI 解读服务异常，请稍后重试。' }) + '\n\n',
      );
      stream.push(null);
    }
  },
};
