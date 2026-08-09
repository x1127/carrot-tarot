/**
 * 一次性 seed 数据生成脚本（在旧 tarot-app 项目内运行，复用其 tsx 与数据源）。
 *
 * 运行：  npx tsx scripts/gen-seed-data.ts
 *
 * 读取 src/data 下的 78 牌 + 4 牌阵 + defaultContent，
 * 转换为 Strapi 结构，写入 carrot-tarot-backend/scripts/seed-data.json。
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { allCards, spreads } from '../src/data';
import { defaultContent } from '../src/data/defaultContent';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 78 张牌 → Strapi card 结构
const cards = allCards.map((c, i) => ({
  cardId: c.id,
  name: c.name,
  englishName: c.englishName,
  arcana: c.arcana,
  suit: c.suit || null,
  number: c.number,
  element: c.element || null,
  keywordsUpright: (c.keywords?.upright || []).map((w: string) => ({ word: w })),
  keywordsReversed: (c.keywords?.reversed || []).map((w: string) => ({ word: w })),
  meaningUpright: c.meaning?.upright || '',
  meaningReversed: c.meaning?.reversed || '',
  sort: i,
}));

// 4 牌阵 → Strapi spread 结构
const spreadData = spreads.map((s, i) => ({
  spreadId: s.id,
  name: s.name,
  cardCount: s.cardCount,
  fixed: s.fixed,
  description: s.description,
  positions: (s.positions || []).map((p) => ({ label: p.label, meaning: p.meaning })),
  sort: i,
}));

// site-content：把旧的 filters / steps 嵌套对象拍平到 schema 字段
const { filters: _deckFilters, ...deckRest } = defaultContent.deck;
const deck = {
  ...deckRest,
  filterAll: defaultContent.deck.filters.all,
  filterMajor: defaultContent.deck.filters.major,
  filterWands: defaultContent.deck.filters.wands,
  filterCups: defaultContent.deck.filters.cups,
  filterSwords: defaultContent.deck.filters.swords,
  filterPentacles: defaultContent.deck.filters.pentacles,
};

const { steps: _divineSteps, ...divineRest } = defaultContent.divine;
const divine = {
  ...divineRest,
  stepSelect: defaultContent.divine.steps.select,
  stepQuestion: defaultContent.divine.steps.question,
  stepDrawing: defaultContent.divine.steps.drawing,
  stepResult: defaultContent.divine.steps.result,
};

const siteContent = {
  site: {
    name: defaultContent.site.name,
    nameEn: defaultContent.site.nameEn,
    footerText: defaultContent.site.footerText,
  },
  home: {
    heroEmoji: defaultContent.home.heroEmoji,
    heroTitle: defaultContent.home.heroTitle,
    heroSubtitle: defaultContent.home.heroSubtitle,
    ctaPrimary: defaultContent.home.ctaPrimary,
    ctaSecondary: defaultContent.home.ctaSecondary,
    statsText: defaultContent.home.statsText,
    sectionTitle: defaultContent.home.sectionTitle,
    sectionSubtitle: defaultContent.home.sectionSubtitle,
    features: defaultContent.home.features.map((f) => ({ title: f.title, desc: f.desc })),
  },
  deck,
  divine,
  history: defaultContent.history,
  about: {
    title: '关于我',
    creatorName: '胡萝卜玩偶',
    body: '一个热爱塔罗与像素画的创作者，用五月天胡萝卜玩偶 IP 把命运之牌画成怪诞又治愈的样子。这里收录了 78 张原创牌面与牌意，愿你在这里找到属于自己的答案。',
    imageUrl: '',
    ipStory:
      '五月天胡萝卜玩偶是这个塔罗牌系列的灵魂 IP——圆滚滚、带着一点傻气，却总能在牌阵里说出最戳心的话。',
  },
  contact: {
    title: '联系方式',
    subtitle: '想定制专属牌阵、约稿或聊聊塔罗？留个言吧。',
    email: null,
    showForm: true,
    socialLinks: [],
  },
};

// theme-config 默认（像素背景与贴纸图 URL 在 Phase 2 由 image API 生成后回填）
const themeConfig = {
  primaryColor: '#FF8C42',
  accentColor: '#7CB342',
  bgImageUrl: '',
  bgImageSize: 'tile',
  stickers: [],
  laptopFrameUrl: '',
  fontHeadingCN: 'ZCOOL KuaiLe',
  fontHeadingEN: 'Cinzel',
  fontBody: 'Noto Sans SC',
};

// ai-config 默认（Key 留空，由管理员在后台填写；systemPrompt 留空走 controller 内置默认）
const aiConfig = {
  llmApiKey: '',
  llmBaseUrl: 'https://api.openai.com/v1',
  llmModel: 'gpt-4o-mini',
  systemPrompt: '',
  enableAi: false,
};

const seed = { cards, spreads: spreadData, siteContent, themeConfig, aiConfig };

const outDir = resolve(__dirname, '../../carrot-tarot-backend/scripts');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'seed-data.json');
writeFileSync(outPath, JSON.stringify(seed, null, 2), 'utf-8');

console.log(`✓ 已写入 ${outPath}`);
console.log(`  cards: ${cards.length}`);
console.log(`  spreads: ${spreadData.length}`);
