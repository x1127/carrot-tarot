import { useState, useRef } from 'react';
import { Sparkles, RotateCcw, Save, Loader2, AlertCircle } from 'lucide-react';
import TarotCardView from './TarotCardView';
import { getCardById, getSpreadById } from '../data';
import type { DrawnCard, ReadingRecord } from '../data/types';
import { interpretReading } from '../api/interpret';
import { useAdminConfigStore } from '../store/adminConfig';

interface ReadingResultProps {
  spreadId: string;
  question?: string;
  cards: DrawnCard[];
  onRestart: () => void;
  onSave: (record: ReadingRecord) => void;
}

export default function ReadingResult({
  spreadId,
  question,
  cards,
  onRestart,
  onSave,
}: ReadingResultProps) {
  const spread = getSpreadById(spreadId);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [saved, setSaved] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // 带位置信息的卡牌（自由抽牌无位置）
  const cardsWithPosition = cards.map((c, i) => ({
    ...c,
    positionLabel: spread && spread.positions[i] ? spread.positions[i].label : undefined,
    positionMeaning: spread && spread.positions[i] ? spread.positions[i].meaning : undefined,
  }));

  const handleInterpret = () => {
    if (aiLoading) {
      abortRef.current?.abort();
      return;
    }
    setAiText('');
    setAiError('');
    setAiLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    interpretReading(
      { question, spreadName: spread?.name || '自由抽牌', cards: cardsWithPosition },
      {
        signal: controller.signal,
        onChunk: (delta) => setAiText((prev) => prev + delta),
        onDone: () => setAiLoading(false),
        onError: (msg) => {
          setAiError(msg);
          setAiLoading(false);
        },
      },
    );
  };

  const handleSave = () => {
    const record: ReadingRecord = {
      id: `reading-${Date.now()}`,
      timestamp: Date.now(),
      spreadId,
      spreadName: spread?.name || '自由抽牌',
      question,
      cards: cardsWithPosition,
      aiInterpretation: aiText || undefined,
    };
    onSave(record);
    setSaved(true);
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* 牌阵标题 */}
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-gold-gradient mb-2">
          {spread?.name || '自由抽牌'}
        </h2>
        {question && (
          <p className="text-[#e8e3f3]/60 italic">「{question}」</p>
        )}
      </div>

      {/* 凯尔特十字：特殊布局；其余：流式网格 */}
      {spreadId === 'celtic' ? (
        <CelticLayout cards={cardsWithPosition} />
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {cardsWithPosition.map((c, i) => {
            const card = getCardById(c.cardId);
            if (!card) return null;
            return (
              <div key={i} className="flex flex-col items-center max-w-[180px]">
                {c.positionLabel && (
                  <div className="mb-3 text-center">
                    <div className="text-[#d4af37] font-serif font-semibold text-sm">
                      {c.positionLabel}
                    </div>
                    <div className="text-[#e8e3f3]/40 text-xs mt-0.5">{c.positionMeaning}</div>
                  </div>
                )}
                <div className="animate-flip-reveal" style={{ animationDelay: `${i * 0.15}s` }}>
                  <TarotCardView card={card} isReversed={c.isReversed} size="md" />
                </div>
                <CardMeaning card={card} isReversed={c.isReversed} />
              </div>
            );
          })}
        </div>
      )}

      {/* AI 解读区 */}
      <div className="max-w-3xl mx-auto">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-serif font-semibold text-[#e8e3f3]">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              AI 深度解读
            </h3>
            <button
              onClick={handleInterpret}
              disabled={aiLoading && false}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#9d4edd]/30 transition-all"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 解读中…（点击停止）
                </>
              ) : aiText ? (
                '重新解读'
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> 获取解读
                </>
              )}
            </button>
          </div>

          {aiError && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm mb-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          {!aiText && !aiLoading && !aiError && (
            <p className="text-[#e8e3f3]/40 text-sm">
              点击「获取解读」，AI 将结合牌阵与位置为你生成个性化的深度解读。
            </p>
          )}

          {aiLoading && !aiText && (
            <div className="flex items-center gap-2 text-[#e8e3f3]/50 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> 正在凝视星象…
            </div>
          )}

          {aiText && (
            <div className="prose prose-invert max-w-none">
              <p className="text-[#e8e3f3]/80 leading-relaxed whitespace-pre-wrap">
                {aiText}
                {aiLoading && <span className="animate-pulse">▋</span>}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 操作 */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleSave}
          disabled={saved}
          className="flex items-center gap-2 px-6 py-3 glass-card text-[#e8e3f3] rounded-xl font-medium hover:border-[#d4af37]/50 transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saved ? '已保存' : '保存到历史'}
        </button>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#9d4edd]/30 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          再次占卜
        </button>
      </div>
    </div>
  );
}

// 单张牌的正逆位牌意小卡
function CardMeaning({
  card,
  isReversed,
}: {
  card: ReturnType<typeof getCardById> extends infer T ? NonNullable<T> : never;
  isReversed: boolean;
}) {
  const cardMeanings = useAdminConfigStore((state) => state.config.cardMeanings);
  const customMeaning = cardMeanings[card.id];
  const meaning = customMeaning?.meaning 
    ? (isReversed ? customMeaning.meaning.reversed : customMeaning.meaning.upright)
    : (isReversed ? card.meaning.reversed : card.meaning.upright);
  const keywords = customMeaning?.keywords
    ? (isReversed ? customMeaning.keywords.reversed : customMeaning.keywords.upright)
    : (isReversed ? card.keywords.reversed : card.keywords.upright);
    
  return (
    <div className="mt-3 text-center max-w-[180px]">
      <span
        className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1.5 ${
          isReversed ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
        }`}
      >
        {isReversed ? '逆位' : '正位'}
      </span>
      {keywords && keywords.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-1.5">
          {keywords.slice(0, 3).map((kw, i) => (
            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded">
              {kw}
            </span>
          ))}
        </div>
      )}
      <p className="text-[#e8e3f3]/60 text-xs leading-relaxed line-clamp-3">{meaning}</p>
    </div>
  );
}

// 凯尔特十字布局：中央十字 + 右侧柱 + 底部
function CelticLayout({ cards }: { cards: (DrawnCard & { positionLabel?: string })[] }) {
  const get = (i: number) => {
    const c = cards[i];
    if (!c) return null;
    const card = getCardById(c.cardId);
    if (!card) return null;
    return { card, c };
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* 十字部分 */}
        <div className="relative" style={{ width: 220, height: 280 }}>
          {/* 1 现状 - 中心 */}
          {(() => {
            const item = get(0);
            return item ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="md" />
              </div>
            ) : null;
          })()}
          {/* 2 阻碍 - 横穿 */}
          {(() => {
            const item = get(1);
            return item ? (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 z-20">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="md" />
              </div>
            ) : null;
          })()}
          {/* 3 基础 - 下方 */}
          {(() => {
            const item = get(2);
            return item ? (
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="sm" />
              </div>
            ) : null;
          })()}
          {/* 4 近期过去 - 左 */}
          {(() => {
            const item = get(3);
            return item ? (
              <div className="absolute left-0 top-1/2 -translate-y-1/2">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="sm" />
              </div>
            ) : null;
          })()}
          {/* 5 可能结果 - 上 */}
          {(() => {
            const item = get(4);
            return item ? (
              <div className="absolute left-1/2 top-0 -translate-x-1/2">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="sm" />
              </div>
            ) : null;
          })()}
          {/* 6 近期未来 - 右 */}
          {(() => {
            const item = get(5);
            return item ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="sm" />
              </div>
            ) : null;
          })()}
        </div>

        {/* 右侧柱 7-10 */}
        <div className="flex flex-col gap-3">
          {[6, 7, 8, 9].map((i) => {
            const item = get(i);
            if (!item) return null;
            return (
              <div key={i} className="flex items-center gap-3">
                <TarotCardView card={item.card} isReversed={item.c.isReversed} size="sm" />
                <div>
                  <div className="text-[#d4af37] text-xs font-semibold">
                    {item.c.positionLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 位置图例 */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-2xl text-xs text-[#e8e3f3]/50">
        {cards.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="text-[#d4af37]">{i + 1}.</span>
            {c.positionLabel}
          </span>
        ))}
      </div>
    </div>
  );
}
