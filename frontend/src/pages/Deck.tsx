import { useState, useMemo } from 'react';
import { X, RefreshCw } from 'lucide-react';
import Navigation from '../components/Navigation';
import StarField from '../components/StarField';
import TarotCardView from '../components/TarotCardView';
import { useContent } from '../hooks/useContent';
import {
  majorCards,
  suitCards,
  suitLabels,
  allCards,
  getCardById,
} from '../data';
import type { TarotCard, Suit } from '../data/types';

type Filter = 'all' | 'major' | Suit;

const filterEmojis: Record<Filter, string> = {
  all: '',
  major: '',
  wands: '🪄',
  cups: '🍷',
  swords: '⚔️',
  pentacles: '💰',
};

function CardDetailModal({ card, onClose }: { card: TarotCard; onClose: () => void }) {
  const [orientation, setOrientation] = useState<'upright' | 'reversed'>('upright');
  const { deck } = useContent();
  const meaning = orientation === 'upright' ? card.meaning.upright : card.meaning.reversed;
  const keywords = orientation === 'upright' ? card.keywords.upright : card.keywords.reversed;
  const suit = card.suit ? suitLabels[card.suit] : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full glass-card rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-[#e8e3f3] hover:bg-black/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* 牌面 */}
          <div className="flex justify-center">
            <div className={orientation === 'reversed' ? 'rotate-180 transition-transform duration-500' : 'transition-transform duration-500'}>
              <TarotCardView card={card} size="lg" />
            </div>
          </div>

          {/* 信息 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#9d4edd]/20 text-[#9d4edd]">
                {card.arcana === 'major' ? deck.arcanaMajor : deck.arcanaMinor}
              </span>
              {suit && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37]">
                  {suit.cn} · {suit.element}
                </span>
              )}
            </div>

            <h2 className="text-3xl font-serif font-bold text-[#e8e3f3] mb-1">{card.name}</h2>
            <p className="text-[#e8e3f3]/50 italic mb-6">{card.englishName}</p>

            {/* 正逆位切换 */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setOrientation('upright')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  orientation === 'upright'
                    ? 'bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white'
                    : 'bg-white/10 text-[#e8e3f3]/70 hover:bg-white/20'
                }`}
              >
                {deck.uprightLabel}
              </button>
              <button
                onClick={() => setOrientation('reversed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                  orientation === 'reversed'
                    ? 'bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white'
                    : 'bg-white/10 text-[#e8e3f3]/70 hover:bg-white/20'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> {deck.reversedLabel}
              </button>
            </div>

            {/* 关键词 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-xs text-[#d4af37]"
                >
                  {kw}
                </span>
              ))}
            </div>

            {/* 牌意 */}
            <div>
              <h3 className="text-sm font-semibold text-[#e8e3f3]/60 mb-2 uppercase tracking-wider">
                {orientation === 'upright' ? deck.uprightMeaningLabel : deck.reversedMeaningLabel}
              </h3>
              <p className="text-[#e8e3f3]/80 leading-relaxed">{meaning}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Deck() {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { deck } = useContent();

  const filterKeys: Filter[] = ['all', 'major', 'wands', 'cups', 'swords', 'pentacles'];

  const cards = useMemo(() => {
    if (filter === 'all') return allCards;
    if (filter === 'major') return majorCards;
    return suitCards[filter as Suit];
  }, [filter]);

  const selectedCard = selectedId ? getCardById(selectedId) : null;

  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navigation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            <span className="text-gold-gradient">{deck.title}</span>
          </h1>
          <p className="text-[#e8e3f3]/50">{deck.subtitle}</p>
        </div>

        {/* 筛选 */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filterKeys.map((key) => {
            const label = deck.filters[key];
            const emoji = filterEmojis[key];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === key
                    ? 'bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white'
                    : 'glass-card text-[#e8e3f3]/70 hover:text-[#e8e3f3]'
                }`}
              >
                {emoji && <span className="mr-1">{emoji}</span>}
                {label}
              </button>
            );
          })}
        </div>

        {/* 牌网格 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="flex flex-col items-center cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i * 0.03, 0.6)}s`, opacity: 0 }}
              onClick={() => setSelectedId(card.id)}
            >
              <TarotCardView card={card} size="md" />
              <span className="mt-2 text-xs text-[#e8e3f3]/60 text-center truncate w-full">
                {card.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
