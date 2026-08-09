// 全站内容默认值 —— 胡萝卜 IP 主题
// 怪诞 · 治愈 · 复古 · 童趣

export interface StickerConfig {
  src: string; // 贴纸图片 URL（透明 PNG）
  top: number; // 顶部偏移 %
  left: number; // 左侧偏移 %
  size: number; // 尺寸 px
  floatSpeed: number; // 浮动周期 s（越小越快）
  floatRange: number; // 浮动幅度 px
  zIndex: number;
}

export interface ThemeConfig {
  primaryColor: string; // 胡萝卜橙
  accentColor: string; // 森林绿
  bgColor: string; // 米白底
  bgImageUrl: string; // 像素森林平铺图
  bgImageSize: 'cover' | 'tile';
  heroImageUrl: string; // Hero 区大图
  stickers: StickerConfig[];
  laptopFrameColor: string; // 笔记本外框色
  baseFontSize: number;
  enableAnimations: boolean;
  enablePixelDust: boolean; // 像素尘埃粒子
}

export interface AnnouncementConfig {
  enabled: boolean;
  variant: 'banner' | 'popup';
  title: string;
  body: string;
  dismissible: boolean;
}

export interface SiteContent {
  // 全站级
  site: {
    name: string;
    nameEn: string;
    footerText: string;
    adminEntryText: string;
    historyEntryText: string; // 页脚历史入口
  };

  // 首页
  home: {
    heroEmoji: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statsText: string;
    sectionTitle: string;
    sectionSubtitle: string;
    features: { emoji: string; title: string; desc: string }[];
  };

  // 牌组大全
  deck: {
    title: string;
    subtitle: string;
    filters: { all: string; major: string; wands: string; cups: string; swords: string; pentacles: string };
    emptyText: string;
    uprightLabel: string;
    reversedLabel: string;
    uprightMeaningLabel: string;
    reversedMeaningLabel: string;
    arcanaMajor: string;
    arcanaMinor: string;
  };

  // 每日一占
  daily: {
    title: string;
    subtitle: string;
    drawButtonText: string;
    shufflingText: string;
    guidanceLabel: string;
    drawnTodayLabel: string;
    redrawBlockedText: string;
    cardOfTodayLabel: string;
  };

  // 自定义占卜
  divine: {
    title: string;
    reselectSpread: string;
    questionLabel: string;
    questionPlaceholder: string;
    freeCountLabel: string;
    drawButtonText: string;
    shufflingText: string;
    steps: { select: string; question: string; drawing: string; result: string };
    noQuestionLabel: string;
    interpretButtonText: string;
    stopInterpretText: string;
    aiUnconfiguredText: string;
    saveHistoryText: string;
  };

  // 关于我
  about: {
    title: string;
    subtitle: string;
    paragraphs: string[];
    ipStoryTitle: string;
    ipStory: string;
  };

  // 联系方式
  contact: {
    title: string;
    subtitle: string;
    showForm: boolean;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitText: string;
    successText: string;
    socialTitle: string;
    socialLinks: { label: string; url: string; emoji: string }[];
  };

  // 历史记录（页脚入口）
  history: {
    title: string;
    subtitleTemplate: string;
    clearButtonText: string;
    clearConfirm: string;
    emptyEmoji: string;
    emptyText: string;
    emptyCta: string;
    noQuestionLabel: string;
    aiLabel: string;
  };

  // 主题与视觉
  theme: ThemeConfig;

  // 活动公告
  announcement: AnnouncementConfig;
}

// 贴纸图片：用 image API 生成的透明胡萝卜贴纸
// 实际部署时可在后台替换；此处用占位 emoji 风格描述
const STICKER_CARROT =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'high saturation flat cartoon sticker of a round cute carrot mascot with green leafy top, thick black outline, kawaii die-cut look, transparent background, simple flat colors, sticker art',
  ) +
  '&image_size=square';

const STICKER_STAR =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'flat cartoon sticker of a cute smiling star with rosy cheeks, thick black outline, kawaii die-cut look, yellow, transparent background',
  ) +
  '&image_size=square';

const STICKER_MOON =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'flat cartoon sticker of a cute crescent moon sleeping with a nightcap, thick black outline, kawaii die-cut look, pastel yellow, transparent background',
  ) +
  '&image_size=square';

const STICKER_CLOUD =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    'flat cartoon sticker of a puffy cute cloud with a smiley face, thick black outline, kawaii die-cut look, white, transparent background',
  ) +
  '&image_size=square';

// 16 位像素森林平铺背景
const PIXEL_FOREST_BG =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    '16-bit pixel art seamless tileable forest background, retro SNES RPG style, lush pine trees, sunlight rays beaming through, warm saturated green and amber colors, grassy ground, no characters, tileable edges, pixelated',
  ) +
  '&image_size=landscape_4_3';

// Hero 区视觉焦点大图
const HERO_FOREST =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent(
    '16-bit pixel art fantasy forest clearing with sunbeams, retro game scene, vibrant warm colors, glowing fireflies, cozy magical atmosphere, no characters, wide landscape',
  ) +
  '&image_size=landscape_16_9';

export const defaultContent: SiteContent = {
  site: {
    name: '胡萝卜塔罗',
    nameEn: 'Carrot Tarot',
    footerText: '🌈 胡萝卜带你窥见命运的褶皱 🌈',
    adminEntryText: '后台',
    historyEntryText: '占卜历史',
  },

  home: {
    heroEmoji: '🥕',
    heroTitle: '胡萝卜塔罗',
    heroSubtitle: '一只戴尖帽的胡萝卜，在像素森林里翻牌。\n78 张手绘牌面，治愈又怪诞的命运小剧场。',
    ctaPrimary: '🔮 每日一占',
    ctaSecondary: '翻翻牌组',
    statsText: '78 张牌 · 4 种牌阵 · AI 流式解牌',
    sectionTitle: '玩点什么',
    sectionSubtitle: '三个入口，三种心情',
    features: [
      {
        emoji: '🗂️',
        title: '牌组大全',
        desc: '78 张手绘牌面一字排开，点开看正逆位牌意与关键词。',
      },
      {
        emoji: '🌙',
        title: '每日一占',
        desc: '一天一张牌，胡萝卜给你今日的小小提示。',
      },
      {
        emoji: '✨',
        title: '自定义占卜',
        desc: '选牌阵、提个问、抽牌、AI 流式解牌，全套仪式感。',
      },
    ],
  },

  deck: {
    title: '牌组大全',
    subtitle: '点开任意一张，看正逆位牌意',
    filters: {
      all: '全部',
      major: '大阿卡纳',
      wands: '权杖',
      cups: '圣杯',
      swords: '宝剑',
      pentacles: '星币',
    },
    emptyText: '这个分类下没有牌',
    uprightLabel: '正位',
    reversedLabel: '逆位',
    uprightMeaningLabel: '正位牌意',
    reversedMeaningLabel: '逆位牌意',
    arcanaMajor: '大阿卡纳',
    arcanaMinor: '小阿卡纳',
  },

  daily: {
    title: '每日一占',
    subtitle: '每天一张牌，胡萝卜给你今日指引',
    drawButtonText: '抽今日牌',
    shufflingText: '胡萝卜正在洗牌…',
    guidanceLabel: '今日指引',
    drawnTodayLabel: '今天已经抽过啦',
    redrawBlockedText: '明天再来抽一张吧～',
    cardOfTodayLabel: '今日之牌',
  },

  divine: {
    title: '自定义占卜',
    reselectSpread: '换个牌阵',
    questionLabel: '你的问题（可选）',
    questionPlaceholder: '把心里的疑惑凝成一句话，比如：我最近的事业会有转机吗？',
    freeCountLabel: '抽取张数：{n} 张',
    drawButtonText: '洗牌抽牌',
    shufflingText: '命运之牌正在洗牌…',
    steps: {
      select: '选牌阵',
      question: '提问题',
      drawing: '抽牌',
      result: '解牌',
    },
    noQuestionLabel: '（无具体问题）',
    interpretButtonText: '🥕 让胡萝卜解读',
    stopInterpretText: '停止',
    aiUnconfiguredText: 'AI 解读未开启，请在后台配置 API Key。',
    saveHistoryText: '存入历史',
  },

  about: {
    title: '关于我',
    subtitle: '一只画塔罗的胡萝卜',
    paragraphs: [
      '你好呀，我是胡萝卜——一只白天画牌、夜里翻牌的玩偶。',
      '这套 78 张塔罗是我一笔一笔画出来的，融合了 16 位像素风的复古底色和扁平卡通的治愈贴纸感。',
      '希望这些怪诞又温柔的小牌，能陪你度过每一个需要指引的夜晚。',
    ],
    ipStoryTitle: 'IP 小故事',
    ipStory:
      '胡萝卜诞生于五月天的一次即兴涂鸦，戴着尖尖的巫师帽，怀里抱着一摞塔罗牌。它相信命运不是用来预测的，而是用来玩耍的。',
  },

  contact: {
    title: '联系方式',
    subtitle: '想定制专属牌阵、约稿或聊聊塔罗？留个言吧。',
    showForm: true,
    nameLabel: '称呼',
    emailLabel: '邮箱（可选）',
    messageLabel: '想说什么',
    submitText: '发送',
    successText: '收到啦！胡萝卜会尽快回复你 🥕',
    socialTitle: '也可以在这些地方找到我',
    socialLinks: [
      { label: '微博', url: '#', emoji: '🐦' },
      { label: '小红书', url: '#', emoji: '📕' },
      { label: '邮箱', url: 'mailto:hello@carrot-tarot.example', emoji: '✉️' },
    ],
  },

  history: {
    title: '占卜历史',
    subtitleTemplate: '共 {n} 次占卜，本地私密保存',
    clearButtonText: '清空',
    clearConfirm: '确定要清空全部历史记录吗？此操作不可恢复。',
    emptyEmoji: '🔮',
    emptyText: '还没有占卜记录',
    emptyCta: '开始第一次占卜',
    noQuestionLabel: '（无具体问题）',
    aiLabel: 'AI 解读',
  },

  theme: {
    primaryColor: '#FF8C42', // 胡萝卜橙
    accentColor: '#7CB342', // 森林绿
    bgColor: '#FFF8E7', // 米白
    bgImageUrl: PIXEL_FOREST_BG,
    bgImageSize: 'tile',
    heroImageUrl: HERO_FOREST,
    stickers: [
      { src: STICKER_CARROT, top: 8, left: 6, size: 110, floatSpeed: 5, floatRange: 14, zIndex: 6 },
      { src: STICKER_STAR, top: 12, left: 82, size: 80, floatSpeed: 4, floatRange: 10, zIndex: 6 },
      { src: STICKER_MOON, top: 62, left: 4, size: 90, floatSpeed: 6, floatRange: 12, zIndex: 6 },
      { src: STICKER_CLOUD, top: 70, left: 86, size: 100, floatSpeed: 7, floatRange: 8, zIndex: 6 },
    ],
    laptopFrameColor: '#5D4037', // 深棕
    baseFontSize: 16,
    enableAnimations: true,
    enablePixelDust: true,
  },

  announcement: {
    enabled: true,
    variant: 'banner',
    title: '🥕 胡萝卜塔罗开张啦',
    body: '78 张手绘牌面已全部上线，每日一占等你来抽～',
    dismissible: true,
  },
};

export { STICKER_CARROT, STICKER_STAR, STICKER_MOON, STICKER_CLOUD, PIXEL_FOREST_BG, HERO_FOREST };
