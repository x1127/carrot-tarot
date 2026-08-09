import type { TarotCard, Suit, Arcana } from './types';
import { majorArcana } from './majorArcana';
import { wands, cups } from './minorArcana1';
import { swords, pentacles } from './minorArcana2';
import { spreads, getSpreadById } from './spreads';

// 全部 78 张牌
export const allCards: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
];

export const getCardById = (id: string): TarotCard | undefined =>
  allCards.find((c) => c.id === id);

export const getCardsByArcana = (arcana: Arcana): TarotCard[] =>
  allCards.filter((c) => c.arcana === arcana);

export const getCardsBySuit = (suit: Suit): TarotCard[] =>
  allCards.filter((c) => c.suit === suit);

export const majorCards = majorArcana;

export const suitCards: Record<Suit, TarotCard[]> = {
  wands,
  cups,
  swords,
  pentacles,
};

export const suitLabels: Record<Suit, { cn: string; en: string; element: string; emoji: string }> = {
  wands: { cn: '权杖', en: 'Wands', element: '火 🔥', emoji: '🪄' },
  cups: { cn: '圣杯', en: 'Cups', element: '水 💧', emoji: '🍷' },
  swords: { cn: '宝剑', en: 'Swords', element: '风 🌬️', emoji: '⚔️' },
  pentacles: { cn: '星币', en: 'Pentacles', element: '土 🌍', emoji: '💰' },
};

export { spreads, getSpreadById };
export type { TarotCard, Suit, Arcana } from './types';
