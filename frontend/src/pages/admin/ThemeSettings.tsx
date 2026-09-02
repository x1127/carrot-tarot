import { useState, useRef } from 'react';
import {
  Palette,
  Upload,
  RotateCcw,
  Sparkles,
  Eye,
  Monitor,
  Type,
  CircleDot,
  Zap,
  Trash2,
  X,
  Check,
  Moon,
  BookOpen,
  History,
  Image as ImageIcon,
  Settings,
  Key,
  type LucideIcon,
} from 'lucide-react';
import { useAdminConfigStore } from '../../store/adminConfig';
import type { CustomFont, IconType } from '../../store/adminConfig';
import ModuleIcon, { PRESET_ICON_GROUPS } from '../../components/ModuleIcon';

const presetColors = [
  { name: '神秘紫', primary: '#9d4edd', accent: '#d4af37' },
  { name: '深紫夜', primary: '#7b2cbf', accent: '#ffd700' },
  { name: '星夜蓝', primary: '#3730a3', accent: '#60a5fa' },
  { name: '翡翠绿', primary: '#059669', accent: '#fbbf24' },
  { name: '玫瑰粉', primary: '#e11d48', accent: '#fde047' },
  { name: '晨曦橙', primary: '#ea580c', accent: '#fef08a' },
];

const cardStyles = [
  { id: 'mystical', name: '神秘', desc: '复古神秘风格' },
  { id: 'minimal', name: '极简', desc: '简洁现代风格' },
  { id: 'elegant', name: '优雅', desc: '优雅精致风格' },
] as const;

// 预设字体（标题/正文通用）
const baseFontOptions = [
  { value: '"Cinzel", "Noto Serif SC", serif', label: 'Cinzel + 思源宋体' },
  { value: '"Noto Serif SC", serif', label: '思源宋体' },
  { value: '"Noto Sans SC", sans-serif', label: '思源黑体' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Microsoft YaHei", sans-serif', label: '微软雅黑' },
  { value: 'system-ui, sans-serif', label: '系统默认' },
];

// 字体格式映射
const fontFormatMap: Record<string, string> = {
  ttf: 'truetype',
  otf: 'opentype',
  woff: 'woff',
  woff2: 'woff2',
};

// 可自定义的图标模块
interface IconModule {
  key: string;
  label: string;
  group: string;
  fallback: LucideIcon;
}

const iconModules: IconModule[] = [
  { key: 'nav.logo', label: '导航栏 Logo', group: '前台页面', fallback: Moon },
  { key: 'home.feature.deck', label: '首页 · 牌组图鉴', group: '前台页面', fallback: BookOpen },
  { key: 'home.feature.divine', label: '首页 · 立即占卜', group: '前台页面', fallback: Sparkles },
  { key: 'home.feature.history', label: '首页 · 历史记录', group: '前台页面', fallback: History },
  { key: 'admin.logo', label: '后台 Logo', group: '管理后台', fallback: Sparkles },
  { key: 'admin.menu.theme', label: '菜单 · 风格设置', group: '管理后台', fallback: Palette },
  { key: 'admin.menu.cards', label: '菜单 · 牌面管理', group: '管理后台', fallback: ImageIcon },
  { key: 'admin.menu.api', label: '菜单 · API配置', group: '管理后台', fallback: Settings },
  { key: 'admin.menu.password', label: '菜单 · 密码设置', group: '管理后台', fallback: Key },
];

export default function ThemeSettings() {
  const config = useAdminConfigStore((state) => state.config);
  const updateTheme = useAdminConfigStore((state) => state.updateTheme);
  const resetConfig = useAdminConfigStore((state) => state.resetConfig);
  const addCustomFont = useAdminConfigStore((state) => state.addCustomFont);
  const removeCustomFont = useAdminConfigStore((state) => state.removeCustomFont);

  const [localTheme, setLocalTheme] = useState(config.theme);
  const [fontUploadError, setFontUploadError] = useState('');

  // 合并预设字体 + 自定义字体
  const fontOptions = [
    ...baseFontOptions,
    ...config.customFonts.map((f) => ({ value: `"${f.name}"`, label: `${f.name}（自定义）` })),
  ];

  const handleColorChange = (key: keyof typeof localTheme, value: string | number | boolean) => {
    setLocalTheme((prev) => ({ ...prev, [key]: value }));
    updateTheme({ [key]: value } as any);
  };

  const handlePresetClick = (colors: { primary: string; accent: string }) => {
    setLocalTheme((prev) => ({ ...prev, primaryColor: colors.primary, accentColor: colors.accent }));
    updateTheme({ primaryColor: colors.primary, accentColor: colors.accent });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLocalTheme((prev) => ({ ...prev, backgroundImage: result }));
        updateTheme({ backgroundImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    resetConfig();
    setLocalTheme(useAdminConfigStore.getState().config.theme);
  };

  const handleRadiusChange = (value: number) => {
    setLocalTheme((prev) => ({ ...prev, borderRadius: value }));
    updateTheme({ borderRadius: value });
  };

  const handleToggleAnimation = () => {
    setLocalTheme((prev) => ({ ...prev, enableAnimations: !prev.enableAnimations }));
    updateTheme({ enableAnimations: !localTheme.enableAnimations });
  };

  // 字体文件上传
  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontUploadError('');
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const format = fontFormatMap[ext];
      if (!format) {
        setFontUploadError(`不支持的字体格式：${file.name}（仅支持 ttf/otf/woff/woff2）`);
        return;
      }
      // 字体名：去掉扩展名
      const fontName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || `Font-${Date.now()}`;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const font: CustomFont = {
          id: `font-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: fontName,
          dataUrl,
          format,
        };
        addCustomFont(font);
      };
      reader.onerror = () => setFontUploadError(`字体读取失败：${file.name}`);
      reader.readAsDataURL(file);
    });
    // 清空 input 以便重复选择同一文件
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-400" />
            风格设置
          </h1>
          <p className="text-purple-300/70 mt-1">自定义网页外观、字体与图标</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
      </div>

      {/* 颜色主题 */}
      <section className="glass-card rounded-2xl p-6 space-y-6">
        <SectionHeader icon={<Sparkles className="w-5 h-5 text-purple-400" />} bg="bg-purple-500/20" title="颜色主题" desc="选择预设配色或自定义颜色" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              className="p-3 rounded-xl border border-purple-500/20 hover:border-amber-500/50 transition-all group"
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: preset.primary }} />
                <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: preset.accent }} />
              </div>
              <span className="text-xs text-purple-300 group-hover:text-white transition-colors">{preset.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ColorInput label="主色调" value={localTheme.primaryColor} onChange={(v) => handleColorChange('primaryColor', v)} />
          <ColorInput label="强调色" value={localTheme.accentColor} onChange={(v) => handleColorChange('accentColor', v)} />
          <ColorInput label="背景色" value={localTheme.backgroundColor} onChange={(v) => handleColorChange('backgroundColor', v)} />
        </div>
      </section>

      {/* 背景图片 */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <SectionHeader icon={<Monitor className="w-5 h-5 text-blue-400" />} bg="bg-blue-500/20" title="背景图片" desc="设置自定义背景图片" />

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-purple-500/30 rounded-xl cursor-pointer hover:border-amber-500/50 hover:bg-purple-500/5 transition-all">
            <Upload className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300">上传背景图片</span>
            <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
          </label>
          {localTheme.backgroundImage && (
            <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden border border-purple-500/20">
              <img src={localTheme.backgroundImage} alt="背景预览" className="w-full h-full object-cover" />
              <button
                onClick={() => handleColorChange('backgroundImage', '')}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 字体设置（增强） */}
      <section className="glass-card rounded-2xl p-6 space-y-5">
        <SectionHeader icon={<Type className="w-5 h-5 text-green-400" />} bg="bg-green-500/20" title="字体设置" desc="导入字体文件、分别设置标题与正文字体" />

        {/* 字体上传 */}
        <div className="space-y-3">
          <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-green-500/30 rounded-xl cursor-pointer hover:border-green-500/60 hover:bg-green-500/5 transition-all">
            <Upload className="w-5 h-5 text-green-400" />
            <span className="text-green-300">导入字体文件（.ttf / .otf / .woff / .woff2）</span>
            <input type="file" accept=".ttf,.otf,.woff,.woff2" multiple onChange={handleFontUpload} className="hidden" />
          </label>
          {fontUploadError && <p className="text-xs text-red-400">{fontUploadError}</p>}

          {/* 已导入字体列表 */}
          {config.customFonts.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-purple-300/70">已导入字体（{config.customFonts.length}）</p>
              <div className="space-y-2">
                {config.customFonts.map((font) => (
                  <div key={font.id} className="flex items-center justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <Type className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate" style={{ fontFamily: `"${font.name}"` }}>{font.name}</p>
                        <p className="text-[10px] text-purple-300/50 uppercase">{font.format}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCustomFont(font.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                      title="删除字体"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 标题/正文字体选择 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FontSelect
            label="标题字体"
            value={localTheme.headingFont}
            options={fontOptions}
            onChange={(v) => {
              setLocalTheme((prev) => ({ ...prev, headingFont: v }));
              updateTheme({ headingFont: v });
            }}
            previewText="神秘塔罗"
            previewClass="font-serif"
          />
          <FontSelect
            label="正文字体"
            value={localTheme.bodyFont}
            options={fontOptions}
            onChange={(v) => {
              setLocalTheme((prev) => ({ ...prev, bodyFont: v }));
              updateTheme({ bodyFont: v });
            }}
            previewText="凝视 78 张命运之牌"
            previewClass=""
          />
        </div>

        {/* 字号 / 行高 / 字间距 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SliderInput
            label="基础字号"
            value={localTheme.baseFontSize}
            min={12}
            max={22}
            step={1}
            unit="px"
            onChange={(v) => {
              setLocalTheme((prev) => ({ ...prev, baseFontSize: v }));
              updateTheme({ baseFontSize: v });
            }}
          />
          <SliderInput
            label="行高"
            value={localTheme.lineHeight}
            min={1.2}
            max={2.2}
            step={0.1}
            unit=""
            onChange={(v) => {
              setLocalTheme((prev) => ({ ...prev, lineHeight: v }));
              updateTheme({ lineHeight: v });
            }}
          />
          <SliderInput
            label="字间距"
            value={localTheme.letterSpacing}
            min={-1}
            max={6}
            step={0.1}
            unit="px"
            onChange={(v) => {
              setLocalTheme((prev) => ({ ...prev, letterSpacing: v }));
              updateTheme({ letterSpacing: v });
            }}
          />
        </div>

        {/* 实时预览 */}
        <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/10">
          <p className="text-[10px] uppercase tracking-wider text-purple-300/50 mb-2">实时预览</p>
          <h4 className="text-2xl font-serif font-bold text-white mb-1" style={{ fontFamily: localTheme.headingFont }}>
            神秘塔罗 · Tarot Divination
          </h4>
          <p className="text-sm text-purple-200/70" style={{ fontFamily: localTheme.bodyFont, fontSize: localTheme.baseFontSize, lineHeight: localTheme.lineHeight, letterSpacing: `${localTheme.letterSpacing}px` }}>
            凝视 78 张命运之牌，聆听宇宙的低语。在牌阵的交错中，寻找属于你的答案。
          </p>
        </div>
      </section>

      {/* 图标自定义 */}
      <section className="glass-card rounded-2xl p-6 space-y-5">
        <SectionHeader icon={<CircleDot className="w-5 h-5 text-amber-400" />} bg="bg-amber-500/20" title="图标自定义" desc="为各模块图标选择预设图标、emoji 或上传图片" />

        <div className="space-y-6">
          {['前台页面', '管理后台'].map((groupName) => (
            <div key={groupName} className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-purple-300/60">{groupName}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {iconModules.filter((m) => m.group === groupName).map((mod) => (
                  <IconEditor key={mod.key} module={mod} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 卡片与效果 */}
      <section className="glass-card rounded-2xl p-6 space-y-6">
        <SectionHeader icon={<CircleDot className="w-5 h-5 text-amber-400" />} bg="bg-amber-500/20" title="卡片与效果" desc="调整卡片样式和动画效果" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cardStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => {
                setLocalTheme((prev) => ({ ...prev, cardStyle: style.id }));
                updateTheme({ cardStyle: style.id });
              }}
              className={`p-4 rounded-xl border transition-all text-left ${
                localTheme.cardStyle === style.id ? 'border-amber-500/50 bg-amber-500/10' : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <p className="font-medium text-white">{style.name}</p>
              <p className="text-xs text-purple-300/60 mt-1">{style.desc}</p>
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-purple-200">圆角大小</label>
            <span className="text-amber-400 font-medium">{localTheme.borderRadius}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="32"
            value={localTheme.borderRadius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-xl">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-white">启用动画效果</p>
              <p className="text-xs text-purple-300/60">页面加载和交互动画</p>
            </div>
          </div>
          <button
            onClick={handleToggleAnimation}
            className={`w-12 h-7 rounded-full transition-all ${localTheme.enableAnimations ? 'bg-amber-500' : 'bg-purple-500/30'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mx-1 ${localTheme.enableAnimations ? 'translate-x-5' : ''}`} />
          </button>
        </div>
      </section>

      {/* 预览按钮 */}
      <button
        onClick={() => window.open('/', '_blank')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-amber-500 rounded-full shadow-2xl hover:shadow-purple-500/40 transition-all flex items-center justify-center"
        title="在新窗口预览"
      >
        <Eye className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

// ============ 子组件 ============

function SectionHeader({ icon, bg, title, desc }: { icon: React.ReactNode; bg: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-purple-300/60">{desc}</p>
      </div>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-purple-500/5 rounded-xl">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
      <div className="flex-1 min-w-0">
        <label className="block text-xs text-purple-300 mb-1">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 bg-purple-950/50 border border-purple-500/20 rounded text-sm text-white focus:outline-none focus:border-amber-500/50"
        />
      </div>
    </div>
  );
}

function FontSelect({
  label,
  value,
  options,
  onChange,
  previewText,
  previewClass,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  previewText: string;
  previewClass: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs text-purple-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-purple-950">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="px-3 py-2 bg-purple-950/40 rounded-lg border border-purple-500/10">
        <p className={`text-white text-base ${previewClass}`} style={{ fontFamily: value }}>
          {previewText}
        </p>
      </div>
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-purple-200">{label}</label>
        <span className="text-amber-400 font-medium text-sm">
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-green-500"
      />
    </div>
  );
}

// 单个图标编辑器
function IconEditor({ module }: { module: IconModule }) {
  const { key, label, fallback } = module;
  const icon = useAdminConfigStore((s) => s.config.icons[key]);
  const setIcon = useAdminConfigStore((s) => s.setIcon);
  const removeIcon = useAdminConfigStore((s) => s.removeIcon);
  const [tab, setTab] = useState<IconType>(icon?.type || 'preset');
  const [emojiInput, setEmojiInput] = useState(icon?.type === 'emoji' ? icon.value : '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIcon(key, { type: 'image', value: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 space-y-3">
      {/* 头部：预览 + 标签 + 重置 */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-amber-500/20 flex items-center justify-center flex-shrink-0">
            <ModuleIcon name={key} fallback={fallback} size={22} className="text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-white truncate">{label}</p>
            <p className="text-[10px] text-purple-300/50 truncate">{icon ? `已自定义 · ${icon.type}` : '默认图标'}</p>
          </div>
        </div>
        {icon && (
          <button
            onClick={() => {
              removeIcon(key);
              setTab('preset');
              setEmojiInput('');
            }}
            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
            title="恢复默认"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 p-1 bg-purple-950/40 rounded-lg">
        {(['preset', 'emoji', 'image'] as IconType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-1.5 text-xs rounded-md transition-all ${
              tab === t ? 'bg-amber-500/20 text-amber-300' : 'text-purple-300/70 hover:text-white'
            }`}
          >
            {t === 'preset' ? '预设图标' : t === 'emoji' ? 'Emoji' : '上传图片'}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      {tab === 'preset' && (
        <div className="max-h-40 overflow-y-auto space-y-2">
          {PRESET_ICON_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="text-[10px] text-purple-300/50 mb-1">{group.group}</p>
              <div className="grid grid-cols-8 gap-1">
                {group.icons.map(({ name, Icon }) => {
                  const selected = icon?.type === 'preset' && icon.value === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setIcon(key, { type: 'preset', value: name })}
                      className={`p-1.5 rounded-md transition-all flex items-center justify-center ${
                        selected ? 'bg-amber-500/30 text-amber-300' : 'text-purple-300/70 hover:bg-purple-500/20 hover:text-white'
                      }`}
                      title={name}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'emoji' && (
        <div className="space-y-2">
          <input
            type="text"
            value={emojiInput}
            onChange={(e) => setEmojiInput(e.target.value)}
            placeholder="输入 emoji，如 🌙 ✦ 🔮"
            className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
          />
          <button
            onClick={() => emojiInput && setIcon(key, { type: 'emoji', value: emojiInput })}
            disabled={!emojiInput}
            className="w-full px-3 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm hover:bg-green-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" /> 应用 Emoji
          </button>
        </div>
      )}

      {tab === 'image' && (
        <div className="space-y-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full px-3 py-4 border-2 border-dashed border-green-500/30 rounded-lg text-green-300 hover:border-green-500/60 hover:bg-green-500/5 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">选择图片</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {icon?.type === 'image' && (
            <div className="flex items-center gap-2 p-2 bg-purple-950/40 rounded-lg">
              <img src={icon.value} alt="" className="w-8 h-8 object-contain rounded" />
              <span className="text-xs text-green-300">已上传图片</span>
              <Check className="w-4 h-4 text-green-400 ml-auto" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
