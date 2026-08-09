import type { DrawnCard } from '../data/types';
import { getCardById } from '../data';
import { useAdminConfigStore } from '../store/adminConfig';

export interface InterpretRequest {
  question?: string;
  spreadName: string;
  cards: DrawnCard[];
}

export interface InterpretOptions {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
  signal?: AbortSignal;
}

// 构建发送给后端的牌面描述（含预设牌意和自定义牌意）
function buildCardContext(cards: DrawnCard[]): string {
  const config = useAdminConfigStore.getState().config;
  const cardMeanings = config.cardMeanings;
  
  return cards
    .map((c, i) => {
      const card = getCardById(c.cardId);
      if (!card) return '';
      const orientation = c.isReversed ? '逆位' : '正位';
      
      // 使用自定义牌意（如果存在）
      const customMeaning = cardMeanings[c.cardId];
      const displayName = customMeaning?.name || card.name;
      const displayEnglishName = customMeaning?.englishName || card.englishName;
      const meaning = customMeaning?.meaning 
        ? (c.isReversed ? customMeaning.meaning.reversed : customMeaning.meaning.upright)
        : (c.isReversed ? card.meaning.reversed : card.meaning.upright);
      const keywords = customMeaning?.keywords
        ? (c.isReversed ? customMeaning.keywords.reversed : customMeaning.keywords.upright)
        : (c.isReversed ? card.keywords.reversed : card.keywords.upright);
      
      const pos = c.positionLabel ? `【位置：${c.positionLabel}】` : `【第${i + 1}张】`;
      const posMeaning = c.positionMeaning ? `（${c.positionMeaning}）` : '';
      const keywordsStr = keywords && keywords.length > 0 ? `\n关键词：${keywords.join('、')}` : '';
      
      return `${pos}${posMeaning} ${displayName}（${displayEnglishName}）${orientation}${keywordsStr}\n牌意：${meaning}`;
    })
    .join('\n\n');
}

export async function interpretReading(req: InterpretRequest, opts: InterpretOptions) {
  // 从管理员配置读取API配置
  const config = useAdminConfigStore.getState().config;
  const apiConfig = config.api.enableAiInterpretation && config.api.llmApiKey
    ? {
        apiKey: config.api.llmApiKey,
        baseUrl: config.api.llmBaseUrl,
        model: config.api.llmModel,
      }
    : undefined;

  const body = {
    question: req.question || '',
    spreadName: req.spreadName,
    cardContext: buildCardContext(req.cards),
    apiConfig,
  };

  let response: Response;
  try {
    response = await fetch('/api/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: opts.signal,
      body: JSON.stringify(body),
    });
  } catch (e) {
    opts.onError('无法连接解读服务，请稍后重试。');
    return;
  }

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => '');
    let message = text;
    // 兼容 SSE 行或 JSON 错误体，提取干净的 error 字段
    const match = text.match(/"error"\s*:\s*"([^"]+)"/);
    if (match) message = match[1];
    opts.onError(message || `解读服务返回错误（${response.status}）`);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // 后端以 SSE 风格按行返回 data: {...}
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') {
          opts.onDone();
          return;
        }
        try {
          const json = JSON.parse(payload);
          if (json.error) {
            opts.onError(json.error);
            return;
          }
          if (json.delta) {
            opts.onChunk(json.delta);
          }
        } catch {
          // 忽略无法解析的行
        }
      }
    }
    opts.onDone();
  } catch (e) {
    if ((e as Error).name === 'AbortError') {
      opts.onDone();
      return;
    }
    opts.onError('解读过程出现异常。');
  }
}
