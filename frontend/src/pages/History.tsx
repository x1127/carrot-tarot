import { Trash2, Clock, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import Navigation from '../components/Navigation';
import StarField from '../components/StarField';
import TarotCardView from '../components/TarotCardView';
import { useContent } from '../hooks/useContent';
import { getCardById } from '../data';
import { useHistoryStore } from '../store/history';
import type { ReadingRecord } from '../data/types';

export default function History() {
  const { records, removeRecord, clearAll } = useHistoryStore();
  const [detail, setDetail] = useState<ReadingRecord | null>(null);
  const { history } = useContent();

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navigation />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">
              <span className="text-gold-gradient">{history.title}</span>
            </h1>
            <p className="text-[#e8e3f3]/50 text-sm">
              {history.subtitleTemplate.replace('{n}', String(records.length))}
            </p>
          </div>
          {records.length > 0 && (
            <button
              onClick={() => {
                if (confirm(history.clearConfirm)) clearAll();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> {history.clearButtonText}
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            {history.emptyEmoji && <div className="text-5xl mb-4">{history.emptyEmoji}</div>}
            <p className="text-[#e8e3f3]/50 mb-6">{history.emptyText}</p>
            <a
              href="/divine"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#9d4edd]/30 transition-all"
            >
              {history.emptyCta}
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((r, i) => (
              <div
                key={r.id}
                className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#d4af37]/40 transition-all animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => setDetail(r)}
              >
                {/* 缩略牌组 */}
                <div className="flex -space-x-6 shrink-0">
                  {r.cards.slice(0, 3).map((c, idx) => {
                    const card = getCardById(c.cardId);
                    if (!card) return null;
                    return (
                      <div key={idx} className={c.isReversed ? 'rotate-180' : ''}>
                        <TarotCardView card={card} size="sm" />
                      </div>
                    );
                  })}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#d4af37] text-sm font-semibold">{r.spreadName}</span>
                    <span className="text-[#e8e3f3]/30 text-xs">·</span>
                    <span className="text-[#e8e3f3]/40 text-xs">{r.cards.length} 张</span>
                  </div>
                  <p className="text-[#e8e3f3]/60 text-sm truncate">
                    {r.question || history.noQuestionLabel}
                  </p>
                  <div className="flex items-center gap-1 text-[#e8e3f3]/30 text-xs mt-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(r.timestamp)}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecord(r.id);
                    }}
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-300 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-[#e8e3f3]/30" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 详情模态 */}
      {detail && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setDetail(null)}
        >
          <div
            className="relative max-w-2xl w-full glass-card rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetail(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-[#e8e3f3] hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold text-[#d4af37] mb-1">
                {detail.spreadName}
              </h2>
              {detail.question && (
                <p className="text-[#e8e3f3]/60 italic">「{detail.question}」</p>
              )}
              <p className="text-[#e8e3f3]/30 text-xs mt-1">{formatDate(detail.timestamp)}</p>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              {detail.cards.map((c, i) => {
                const card = getCardById(c.cardId);
                if (!card) return null;
                return (
                  <div key={i} className="flex flex-col items-center max-w-[120px]">
                    {c.positionLabel && (
                      <span className="text-[#d4af37] text-xs mb-2">{c.positionLabel}</span>
                    )}
                    <div className={c.isReversed ? 'rotate-180' : ''}>
                      <TarotCardView card={card} size="sm" />
                    </div>
                    <span
                      className={`mt-2 text-xs ${
                        c.isReversed ? 'text-red-300' : 'text-green-300'
                      }`}
                    >
                      {c.isReversed ? '逆位' : '正位'}
                    </span>
                  </div>
                );
              })}
            </div>

            {detail.aiInterpretation && (
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="text-[#d4af37] text-sm font-semibold mb-2">{history.aiLabel}</h3>
                <p className="text-[#e8e3f3]/70 text-sm leading-relaxed whitespace-pre-wrap">
                  {detail.aiInterpretation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
