import type { Spread } from './types';

// 四种牌阵定义
export const spreads: Spread[] = [
  {
    id: 'single',
    name: '单张牌',
    cardCount: 1,
    fixed: true,
    description: '抽一张牌快速占卜，聚焦当下最核心的讯息。适合简单直接的提问。',
    positions: [
      { label: '今日指引', meaning: '此刻最需要关注的焦点与讯息' },
    ],
  },
  {
    id: 'three',
    name: '三张牌阵',
    cardCount: 3,
    fixed: true,
    description: '经典三牌阵，从时间的脉络解读过去、现在与未来的走势。',
    positions: [
      { label: '过去', meaning: '影响当下的过往因素与根源' },
      { label: '现在', meaning: '此刻所处的状态与核心议题' },
      { label: '未来', meaning: '若维持现状可能的发展走向' },
    ],
  },
  {
    id: 'celtic',
    name: '凯尔特十字',
    cardCount: 10,
    fixed: true,
    description: '传统十张高级牌阵，全方位解读现状、阻碍、潜能与最终走向。',
    positions: [
      { label: '现状', meaning: '当下的核心处境' },
      { label: '阻碍', meaning: '横亘眼前的挑战或阻力' },
      { label: '基础', meaning: '问题的深层根源与根基' },
      { label: '近期过去', meaning: '刚刚发生、影响当下的因素' },
      { label: '可能结果', meaning: '近期最可能出现的结果' },
      { label: '近期未来', meaning: '即将到来的发展' },
      { label: '自我', meaning: '你对此事的态度与立场' },
      { label: '环境', meaning: '外界人事对你的影响' },
      { label: '希望与恐惧', meaning: '内心深处的期盼与忧虑' },
      { label: '最终结果', meaning: '此事最终的总体走向' },
    ],
  },
  {
    id: 'free',
    name: '自由抽牌',
    cardCount: 0,
    fixed: false,
    description: '自由选择抽取任意数量的牌，无固定位置含义，随心探索。',
    positions: [],
  },
];

export const getSpreadById = (id: string): Spread | undefined =>
  spreads.find((s) => s.id === id);
