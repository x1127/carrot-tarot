// 塔罗牌数据类型定义

export type Arcana = 'major' | 'minor';

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

export type Element = 'fire' | 'water' | 'air' | 'earth';

export interface TarotCard {
  id: string; // 如 "major-00", "wands-01"
  name: string; // 中文名 "愚者"
  englishName: string; // 英文名 "The Fool"
  arcana: Arcana;
  suit?: Suit; // 小阿卡纳花色
  number: number; // 0-21(大) / 1-14(小)
  imageUrl?: string; // 牌面图（预留，初期占位）
  element?: Element;
  keywords: {
    upright: string[];
    reversed: string[];
  };
  meaning: {
    upright: string; // 预设正位牌意
    reversed: string; // 预设逆位牌意
  };
}

export interface SpreadPosition {
  label: string; // "过去"
  meaning: string; // 位置含义
}

export interface Spread {
  id: string;
  name: string; // "三张牌阵"
  cardCount: number; // 1 / 3 / 10 / 自定义
  description: string;
  fixed: boolean; // 是否固定张数
  positions: SpreadPosition[];
}

export interface DrawnCard {
  cardId: string;
  isReversed: boolean; // 正逆位
  positionLabel?: string;
  positionMeaning?: string;
}

export interface ReadingRecord {
  id: string;
  timestamp: number;
  spreadId: string;
  spreadName: string;
  question?: string;
  cards: DrawnCard[];
  aiInterpretation?: string;
}
