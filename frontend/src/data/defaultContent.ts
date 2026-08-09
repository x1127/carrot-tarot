// 全站内容默认值
// 后期新增页面（常见问题、照片墙、留言板等）只需在此追加模块即可

export interface SiteContent {
  // 全站级
  site: {
    name: string;           // 站点名
    nameEn: string;         // 英文标语
    footerText: string;     // 页脚文案
    adminEntryText: string; // 管理后台入口文字
  };

  // 首页 Home
  home: {
    heroEmoji: string;        // Hero emoji（可留空关闭）
    heroTitle: string;        // 主标题
    heroSubtitle: string;     // 副标题
    ctaPrimary: string;       // 主按钮文字
    ctaSecondary: string;     // 次按钮文字
    statsText: string;        // 底部统计文案
    sectionTitle: string;     // 功能区标题
    sectionSubtitle: string;  // 功能区副标题
    features: { title: string; desc: string }[];  // 三张功能卡片
  };

  // 牌组图鉴页 Deck
  deck: {
    title: string;
    subtitle: string;
    filters: { all: string; major: string; wands: string; cups: string; swords: string; pentacles: string };
    emptyText: string;
    uprightLabel: string;     // 正位按钮
    reversedLabel: string;    // 逆位按钮
    uprightMeaningLabel: string;  // 正位牌意标题
    reversedMeaningLabel: string; // 逆位牌意标题
    arcanaMajor: string;      // 大阿卡纳标签
    arcanaMinor: string;      // 小阿卡纳标签
  };

  // 占卜抽牌页 Divine
  divine: {
    title: string;
    reselectSpread: string;   // 重新选择牌阵
    questionLabel: string;    // 你的问题（可选）
    questionPlaceholder: string;
    freeCountLabel: string;   // 抽取张数：N 张
    drawButtonText: string;   // 洗牌抽牌
    shufflingText: string;    // 命运之牌正在洗牌…
    steps: { select: string; question: string; drawing: string; result: string };
    noQuestionLabel: string;  // （无具体问题）
  };

  // 历史记录页 History
  history: {
    title: string;
    subtitleTemplate: string; // 共 {n} 次占卜，本地私密保存
    clearButtonText: string;
    clearConfirm: string;     // 清空确认弹窗
    emptyEmoji: string;       // 空状态 emoji
    emptyText: string;        // 还没有占卜记录
    emptyCta: string;         // 开始第一次占卜
    noQuestionLabel: string;  // （无具体问题）
    aiLabel: string;          // AI 解读
  };

  // 星空特效
  starfield: {
    enabled: boolean;
    density: number;       // 密度系数（越大星越多）
    color: string;         // 星星颜色 hex
    glowColor: string;     // 大星光晕颜色 hex
    twinkleSpeed: number;  // 闪烁速度
  };

  // 全局背景渐变
  background: {
    gradient1: string;  // 第一处 radial 颜色
    gradient2: string;  // 第二处 radial 颜色
  };
}

export const defaultContent: SiteContent = {
  site: {
    name: '神秘塔罗',
    nameEn: 'Tarot Divination',
    footerText: '✦ 命运在你手中 ✦',
    adminEntryText: '管理后台',
  },

  home: {
    heroEmoji: '🌙',
    heroTitle: '神秘塔罗',
    heroSubtitle: '凝视 78 张命运之牌，聆听宇宙的低语。\n在牌阵的交错中，寻找属于你的答案。',
    ctaPrimary: '✦ 立即占卜',
    ctaSecondary: '浏览牌组',
    statsText: '共 78 张牌 · 4 种牌阵 · AI 个性化解读',
    sectionTitle: '开启你的旅程',
    sectionSubtitle: '三重体验，探索塔罗的奥秘',
    features: [
      { title: '牌组图鉴', desc: '浏览完整的 78 张塔罗牌，探索每张牌的正逆位牌意与关键词。' },
      { title: '立即占卜', desc: '选择牌阵、抽取命运之牌，结合预设牌意与 AI 获得个性化解读。' },
      { title: '历史记录', desc: '回看每一次占卜的牌阵、抽牌结果与解读，本地私密保存。' },
    ],
  },

  deck: {
    title: '牌组图鉴',
    subtitle: '点击任意一张牌，查看正逆位牌意与关键词',
    filters: {
      all: '全部',
      major: '大阿卡纳',
      wands: '权杖',
      cups: '圣杯',
      swords: '宝剑',
      pentacles: '星币',
    },
    emptyText: '该分类下暂无卡牌',
    uprightLabel: '正位',
    reversedLabel: '逆位',
    uprightMeaningLabel: '正位牌意',
    reversedMeaningLabel: '逆位牌意',
    arcanaMajor: '大阿卡纳',
    arcanaMinor: '小阿卡纳',
  },

  divine: {
    title: '占卜抽牌',
    reselectSpread: '重新选择牌阵',
    questionLabel: '你的问题（可选）',
    questionPlaceholder: '将心中的疑惑凝练成一句话，例如：我近期的感情会如何发展？',
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
  },

  history: {
    title: '历史记录',
    subtitleTemplate: '共 {n} 次占卜，本地私密保存',
    clearButtonText: '清空',
    clearConfirm: '确定要清空全部历史记录吗？此操作不可恢复。',
    emptyEmoji: '🔮',
    emptyText: '还没有占卜记录',
    emptyCta: '开始第一次占卜',
    noQuestionLabel: '（无具体问题）',
    aiLabel: 'AI 解读',
  },

  starfield: {
    enabled: true,
    density: 9000,       // 分母，越小星越多
    color: '#e8e3f3',
    glowColor: '#d4af37',
    twinkleSpeed: 2,
  },

  background: {
    gradient1: 'rgba(157, 78, 221, 0.15)',
    gradient2: 'rgba(102, 51, 153, 0.12)',
  },
};
