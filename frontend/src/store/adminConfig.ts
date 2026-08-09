import { create } from 'zustand';
import { getCardById } from '../data';
import { defaultContent } from '../data/defaultContent';
import type { SiteContent } from '../data/defaultContent';
import type { TarotCard } from '../data/types';

const ADMIN_CONFIG_KEY = 'tarot-admin-config';

// 自定义字体
export interface CustomFont {
  id: string;
  name: string;       // font-family 名称
  dataUrl: string;    // base64 data URL
  format: string;     // truetype | opentype | woff | woff2
}

// 图标自定义（预设图标 / emoji / 图片 三选一）
export type IconType = 'preset' | 'emoji' | 'image';
export interface CustomIcon {
  type: IconType;
  value: string; // preset: 图标名; emoji: 字符; image: data URL
}
export type IconConfig = Record<string, CustomIcon>;

// 网页风格配置
export interface ThemeConfig {
  primaryColor: string;      // 主色调
  accentColor: string;       // 强调色
  backgroundColor: string;   // 背景色
  backgroundImage: string;   // 背景图片URL
  fontFamily: string;        // 兼容旧版：正文字体
  headingFont: string;       // 标题字体
  bodyFont: string;          // 正文字体
  baseFontSize: number;      // 基础字号 px
  lineHeight: number;        // 行高
  letterSpacing: number;     // 字间距 px
  cardStyle: 'mystical' | 'minimal' | 'elegant'; // 卡片风格
  borderRadius: number;      // 圆角大小
  enableAnimations: boolean; // 启用动画
}

// API配置
export interface ApiConfig {
  llmApiKey: string;
  llmBaseUrl: string;
  llmModel: string;
  enableAiInterpretation: boolean;
}

// 牌面图片映射
export interface CardImageMap {
  [cardId: string]: string; // cardId -> 图片URL
}

// 自定义牌意数据
export interface CardMeaningData {
  name?: string;           // 中文名称
  englishName?: string;    // 英文名称
  keywords?: {
    upright: string[];
    reversed: string[];
  };
  meaning?: {
    upright: string;
    reversed: string;
  };
}

// 自定义牌意映射
export interface CardMeaningMap {
  [cardId: string]: CardMeaningData;
}

export interface AdminConfig {
  theme: ThemeConfig;
  api: ApiConfig;
  cardImages: CardImageMap;
  cardMeanings: CardMeaningMap;
  customFonts: CustomFont[];
  icons: IconConfig;
  siteContent: SiteContent;
}

const defaultConfig: AdminConfig = {
  theme: {
    primaryColor: '#9d4edd',
    accentColor: '#d4af37',
    backgroundColor: '#0d0518',
    backgroundImage: '',
    fontFamily: '"Noto Serif SC", serif',
    headingFont: '"Cinzel", "Noto Serif SC", serif',
    bodyFont: '"Noto Serif SC", serif',
    baseFontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
    cardStyle: 'mystical',
    borderRadius: 16,
    enableAnimations: true,
  },
  api: {
    llmApiKey: '',
    llmBaseUrl: 'https://api.openai.com/v1',
    llmModel: 'gpt-4o-mini',
    enableAiInterpretation: true,
  },
  cardImages: {},
  cardMeanings: {},
  customFonts: [],
  icons: {},
  siteContent: defaultContent,
};

const loadConfig = (): AdminConfig => {
  try {
    const raw = localStorage.getItem(ADMIN_CONFIG_KEY);
    if (!raw) return defaultConfig;
    const saved = JSON.parse(raw);
    return {
      ...defaultConfig,
      ...saved,
      theme: { ...defaultConfig.theme, ...saved.theme },
      api: { ...defaultConfig.api, ...saved.api },
      cardImages: { ...saved.cardImages },
      cardMeanings: { ...saved.cardMeanings },
      customFonts: Array.isArray(saved.customFonts) ? saved.customFonts : [],
      icons: { ...(saved.icons || {}) },
      siteContent: { ...defaultContent, ...(saved.siteContent || {}) },
    };
  } catch {
    return defaultConfig;
  }
};

const saveConfig = (config: AdminConfig) => {
  try {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // 忽略存储失败（可能字体文件过大超出 localStorage 配额）
  }
};

// 已注入的自定义字体名集合，避免重复加载
const loadedFontIds = new Set<string>();

// 通过 FontFace API 注入自定义字体到文档
const injectFonts = (fonts: CustomFont[]) => {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  fonts.forEach((font) => {
    if (loadedFontIds.has(font.id)) return;
    try {
      const face = new FontFace(font.name, `url(${font.dataUrl})`, {
        format: font.format,
      } as FontFaceDescriptors);
      face.load().then(() => {
        (document as Document).fonts.add(face);
        loadedFontIds.add(font.id);
      }).catch(() => {
        // 字体加载失败，忽略
      });
    } catch {
      // FontFace 构造失败，忽略
    }
  });
};

interface AdminConfigStore {
  config: AdminConfig;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateApi: (api: Partial<ApiConfig>) => void;
  setCardImage: (cardId: string, imageUrl: string) => void;
  removeCardImage: (cardId: string) => void;
  setCardMeaning: (cardId: string, data: CardMeaningData) => void;
  removeCardMeaning: (cardId: string) => void;
  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (id: string) => void;
  setIcon: (key: string, icon: CustomIcon) => void;
  removeIcon: (key: string) => void;
  updateContent: (partial: Partial<SiteContent>) => void;
  resetContent: () => void;
  resetConfig: () => void;
  applyTheme: () => void;
  getCardWithMeaning: (cardId: string) => import('../data/types').TarotCard | undefined;
}

export const useAdminConfigStore = create<AdminConfigStore>((set, get) => ({
  config: loadConfig(),

  updateTheme: (theme) => {
    const newConfig = {
      ...get().config,
      theme: { ...get().config.theme, ...theme },
    };
    saveConfig(newConfig);
    set({ config: newConfig });
    get().applyTheme();
  },

  updateApi: (api) => {
    const newConfig = {
      ...get().config,
      api: { ...get().config.api, ...api },
    };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  setCardImage: (cardId, imageUrl) => {
    const newConfig = {
      ...get().config,
      cardImages: { ...get().config.cardImages, [cardId]: imageUrl },
    };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  removeCardImage: (cardId) => {
    const newCardImages = { ...get().config.cardImages };
    delete newCardImages[cardId];
    const newConfig = { ...get().config, cardImages: newCardImages };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  setCardMeaning: (cardId, data) => {
    const newConfig = {
      ...get().config,
      cardMeanings: { ...get().config.cardMeanings, [cardId]: data },
    };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  removeCardMeaning: (cardId) => {
    const newCardMeanings = { ...get().config.cardMeanings };
    delete newCardMeanings[cardId];
    const newConfig = { ...get().config, cardMeanings: newCardMeanings };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  addCustomFont: (font) => {
    const newConfig = {
      ...get().config,
      customFonts: [...get().config.customFonts, font],
    };
    saveConfig(newConfig);
    set({ config: newConfig });
    injectFonts([font]);
  },

  removeCustomFont: (id) => {
    const newFonts = get().config.customFonts.filter((f) => f.id !== id);
    const newConfig = { ...get().config, customFonts: newFonts };
    saveConfig(newConfig);
    set({ config: newConfig });
    loadedFontIds.delete(id);
  },

  setIcon: (key, icon) => {
    const newIcons = { ...get().config.icons, [key]: icon };
    const newConfig = { ...get().config, icons: newIcons };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  removeIcon: (key) => {
    const newIcons = { ...get().config.icons };
    delete newIcons[key];
    const newConfig = { ...get().config, icons: newIcons };
    saveConfig(newConfig);
    set({ config: newConfig });
  },

  updateContent: (partial) => {
    const newConfig = {
      ...get().config,
      siteContent: { ...get().config.siteContent, ...partial },
    };
    saveConfig(newConfig);
    set({ config: newConfig });
    get().applyTheme();
  },

  resetContent: () => {
    const newConfig = { ...get().config, siteContent: defaultContent };
    saveConfig(newConfig);
    set({ config: newConfig });
    get().applyTheme();
  },

  getCardWithMeaning: (cardId) => {
    const card = getCardById(cardId);
    if (!card) return undefined;
    const customMeaning = get().config.cardMeanings[cardId];
    if (!customMeaning) return card;
    return {
      ...card,
      name: customMeaning.name || card.name,
      englishName: customMeaning.englishName || card.englishName,
      keywords: customMeaning.keywords || card.keywords,
      meaning: customMeaning.meaning || card.meaning,
    } as TarotCard;
  },

  resetConfig: () => {
    loadedFontIds.clear();
    saveConfig(defaultConfig);
    set({ config: defaultConfig });
    get().applyTheme();
  },

  applyTheme: () => {
    const { theme, customFonts, siteContent } = get().config;
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--font-family', theme.bodyFont);
    root.style.setProperty('--font-heading', theme.headingFont);
    root.style.setProperty('--font-body', theme.bodyFont);
    root.style.setProperty('--font-size-base', `${theme.baseFontSize}px`);
    root.style.setProperty('--line-height', String(theme.lineHeight));
    root.style.setProperty('--letter-spacing', `${theme.letterSpacing}px`);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);

    // 背景渐变（来自 siteContent.background）
    root.style.setProperty('--bg-gradient-1', siteContent.background.gradient1);
    root.style.setProperty('--bg-gradient-2', siteContent.background.gradient2);

    if (theme.backgroundImage) {
      document.body.style.backgroundImage = `url(${theme.backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    } else {
      document.body.style.backgroundImage = '';
    }

    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.fontSize = `${theme.baseFontSize}px`;
    document.body.style.lineHeight = String(theme.lineHeight);
    document.body.style.letterSpacing = `${theme.letterSpacing}px`;

    if (!theme.enableAnimations) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.setProperty('--animation-duration', '1s');
    }

    // 注入自定义字体
    injectFonts(customFonts);
  },
}));

// 初始化时应用主题（颜色、字体、动画、注入字体）
useAdminConfigStore.getState().applyTheme();
