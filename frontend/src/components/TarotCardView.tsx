import { useMemo } from 'react';
import type { TarotCard } from '../data/types';
import { suitLabels } from '../data';
import { useAdminConfigStore } from '../store/adminConfig';

interface TarotCardViewProps {
  card: TarotCard;
  isReversed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBack?: boolean;
  onClick?: () => void;
  className?: string;
}

const sizeMap = {
  sm: 'w-16 h-28 text-[10px]',
  md: 'w-28 h-44 text-xs',
  lg: 'w-40 h-64 text-sm',
};

// 占位牌面：当无 imageUrl 时用 SVG 风格渲染神秘牌面
function CardFace({ card, size, customImage, customMeaning }: { 
  card: TarotCard; 
  size: 'sm' | 'md' | 'lg'; 
  customImage?: string;
  customMeaning?: { name?: string; englishName?: string };
}) {
  const displayName = customMeaning?.name || card.name;
  const displayEnglishName = customMeaning?.englishName || card.englishName;
  
  const suit = card.suit ? suitLabels[card.suit] : null;
  const symbol = useMemo(() => {
    if (card.arcana === 'major') return '✦';
    switch (card.suit) {
      case 'wands':
        return '🪄';
      case 'cups':
        return '🍷';
      case 'swords':
        return '⚔️';
      case 'pentacles':
        return '💰';
      default:
        return '✦';
    }
  }, [card]);

  const numLabel =
    card.arcana === 'major'
      ? `${card.number}`
      : card.number === 1
      ? 'A'
      : card.number === 11
      ? '侍从'
      : card.number === 12
      ? '骑士'
      : card.number === 13
      ? '王后'
      : card.number === 14
      ? '国王'
      : `${card.number}`;

  if (customImage || card.imageUrl) {
    return (
      <img
        src={customImage || card.imageUrl}
        alt={displayName}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-gradient-to-b from-[#2d1b4e] via-[#1a0b2e] to-[#0d0518] relative overflow-hidden">
      {/* 装饰边框 */}
      <div className="absolute inset-1 border border-[#d4af37]/40 rounded-md pointer-events-none" />
      <div className="absolute inset-1.5 border border-[#d4af37]/20 rounded-md pointer-events-none" />

      {/* 顶部数字 */}
      <div className="w-full flex justify-between px-1 z-10">
        <span className="text-[#d4af37] font-serif font-bold">{numLabel}</span>
        <span className={size === 'sm' ? 'text-xs' : 'text-base'}>{symbol}</span>
      </div>

      {/* 中央符号 */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div
          className={`text-[#d4af37] ${size === 'sm' ? 'text-2xl' : 'text-4xl'} drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]`}
        >
          {symbol}
        </div>
        {size !== 'sm' && (
          <div className="mt-2 text-center">
            <div className="text-[#e8e3f3] font-serif font-semibold leading-tight">
              {displayName}
            </div>
            <div className="text-[#9d4edd]/80 text-[10px] mt-0.5 italic">
              {displayEnglishName}
            </div>
          </div>
        )}
      </div>

      {/* 底部花色/元素 */}
      <div className="w-full flex justify-between px-1 z-10">
        <span className={size === 'sm' ? 'text-xs' : 'text-base'}>{symbol}</span>
        <span className="text-[#d4af37]/70 text-[9px]">
          {suit ? suit.cn : '大阿卡纳'}
        </span>
      </div>
    </div>
  );
}

export default function TarotCardView({
  card,
  isReversed = false,
  size = 'md',
  showBack = false,
  onClick,
  className = '',
}: TarotCardViewProps) {
  const cardImages = useAdminConfigStore((state) => state.config.cardImages);
  const cardMeanings = useAdminConfigStore((state) => state.config.cardMeanings);
  const customImage = cardImages[card.id];
  const customMeaning = cardMeanings[card.id];
  const reversedClass = isReversed ? 'rotate-180' : '';

  if (showBack) {
    return (
      <div
        onClick={onClick}
        className={`${sizeMap[size]} rounded-lg cursor-pointer relative overflow-hidden border-2 border-[#d4af37]/50 shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#9d4edd]/40 transition-shadow ${className}`}
      >
        <div className="w-full h-full bg-gradient-to-br from-[#2d1b4e] via-[#1a0b2e] to-[#0d0518] flex items-center justify-center">
          <div className="absolute inset-2 border border-[#d4af37]/40 rounded-md" />
          <div className="absolute inset-3 border border-[#d4af37]/20 rounded-md" />
          <div className="text-[#d4af37] text-3xl drop-shadow-[0_0_10px_rgba(212,175,55,0.7)] animate-pulse">
            ✦
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${sizeMap[size]} rounded-lg cursor-pointer relative overflow-hidden border-2 border-[#d4af37]/50 shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#9d4edd]/50 hover:-translate-y-1 transition-all duration-300 ${reversedClass} ${className}`}
    >
      <CardFace card={card} size={size} customImage={customImage} customMeaning={customMeaning} />
    </div>
  );
}
