import { useState } from 'react';
import { FileText, RotateCcw, Star, Palette, Home, Layers, Clock, Sparkles } from 'lucide-react';
import { useAdminConfigStore } from '../../store/adminConfig';
import type { SiteContent } from '../../data/defaultContent';

export default function ContentSettings() {
  const config = useAdminConfigStore((s) => s.config);
  const updateContent = useAdminConfigStore((s) => s.updateContent);
  const resetContent = useAdminConfigStore((s) => s.resetContent);
  const [local, setLocal] = useState<SiteContent>(config.siteContent);

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    updateContent({ [key]: value } as any);
  };

  const setNested = <K extends keyof SiteContent, SK extends keyof SiteContent[K]>(
    key: K,
    subKey: SK,
    value: SiteContent[K][SK]
  ) => {
    setLocal((prev) => ({
      ...prev,
      [key]: { ...prev[key], [subKey]: value },
    }));
    updateContent({ [key]: { ...local[key], [subKey]: value } } as any);
  };

  const handleReset = () => {
    if (confirm('确定要恢复全部默认内容吗？所有自定义文字将丢失。')) {
      resetContent();
      setLocal(useAdminConfigStore.getState().config.siteContent);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            内容设置
          </h1>
          <p className="text-purple-300/70 mt-1">自定义全站文字、图片、背景与特效</p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          恢复默认
        </button>
      </div>

      {/* 1. 全站信息 */}
      <Section icon={<Home className="w-5 h-5 text-purple-400" />} bg="bg-purple-500/20" title="全站信息" desc="站点名称、标语、页脚等">
        <TextField label="站点名称" value={local.site.name} onChange={(v) => setNested('site', 'name', v)} />
        <TextField label="英文标语" value={local.site.nameEn} onChange={(v) => setNested('site', 'nameEn', v)} />
        <TextField label="页脚文案" value={local.site.footerText} onChange={(v) => setNested('site', 'footerText', v)} />
        <TextField label="管理后台入口文字" value={local.site.adminEntryText} onChange={(v) => setNested('site', 'adminEntryText', v)} />
      </Section>

      {/* 2. 首页内容 */}
      <Section icon={<Sparkles className="w-5 h-5 text-amber-400" />} bg="bg-amber-500/20" title="首页内容" desc="Hero 区、功能卡片、CTA 按钮">
        <TextField label="Hero Emoji（留空则隐藏）" value={local.home.heroEmoji} onChange={(v) => setNested('home', 'heroEmoji', v)} placeholder="🌙 或 🔮 或留空" />
        <TextField label="主标题" value={local.home.heroTitle} onChange={(v) => setNested('home', 'heroTitle', v)} />
        <TextAreaField label="副标题（换行用 \\n）" value={local.home.heroSubtitle} onChange={(v) => setNested('home', 'heroSubtitle', v)} rows={3} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="主按钮文字" value={local.home.ctaPrimary} onChange={(v) => setNested('home', 'ctaPrimary', v)} />
          <TextField label="次按钮文字" value={local.home.ctaSecondary} onChange={(v) => setNested('home', 'ctaSecondary', v)} />
        </div>
        <TextField label="底部统计文案" value={local.home.statsText} onChange={(v) => setNested('home', 'statsText', v)} />
        <TextField label="功能区标题" value={local.home.sectionTitle} onChange={(v) => setNested('home', 'sectionTitle', v)} />
        <TextField label="功能区副标题" value={local.home.sectionSubtitle} onChange={(v) => setNested('home', 'sectionSubtitle', v)} />

        {/* 三张功能卡片 */}
        <div className="space-y-3 pt-2">
          <p className="text-xs uppercase tracking-wider text-purple-300/60">功能卡片（3 张）</p>
          {local.home.features.map((f, i) => (
            <div key={i} className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/10 space-y-2">
              <p className="text-xs text-amber-300">卡片 {i + 1}</p>
              <TextField
                label="标题"
                value={f.title}
                onChange={(v) => {
                  const next = [...local.home.features];
                  next[i] = { ...next[i], title: v };
                  setNested('home', 'features', next as any);
                }}
              />
              <TextAreaField
                label="描述"
                value={f.desc}
                onChange={(v) => {
                  const next = [...local.home.features];
                  next[i] = { ...next[i], desc: v };
                  setNested('home', 'features', next as any);
                }}
                rows={2}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* 3. 牌组图鉴页 */}
      <Section icon={<Layers className="w-5 h-5 text-blue-400" />} bg="bg-blue-500/20" title="牌组图鉴页" desc="标题、筛选标签、正逆位">
        <TextField label="页面标题" value={local.deck.title} onChange={(v) => setNested('deck', 'title', v)} />
        <TextField label="副标题" value={local.deck.subtitle} onChange={(v) => setNested('deck', 'subtitle', v)} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <TextField label="全部" value={local.deck.filters.all} onChange={(v) => setNested('deck', 'filters', { ...local.deck.filters, all: v } as any)} />
          <TextField label="大阿卡纳" value={local.deck.filters.major} onChange={(v) => setNested('deck', 'filters', { ...local.deck.filters, major: v } as any)} />
          <TextField label="权杖" value={local.deck.filters.wands} onChange={(v) => setNested('deck', 'filters', { ...local.deck.filters, wands: v } as any)} />
          <TextField label="圣杯" value={local.deck.filters.cups} onChange={(v) => setNested('deck', 'filters', { ...local.deck.filters, cups: v } as any)} />
          <TextField label="宝剑" value={local.deck.filters.swords} onChange={(v) => setNested('deck', 'filters', { ...local.deck.filters, swords: v } as any)} />
          <TextField label="星币" value={local.deck.filters.pentacles} onChange={(v) => setNested('deck', 'filters', { ...local.deck.filters, pentacles: v } as any)} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <TextField label="正位按钮" value={local.deck.uprightLabel} onChange={(v) => setNested('deck', 'uprightLabel', v)} />
          <TextField label="逆位按钮" value={local.deck.reversedLabel} onChange={(v) => setNested('deck', 'reversedLabel', v)} />
          <TextField label="正位牌意标题" value={local.deck.uprightMeaningLabel} onChange={(v) => setNested('deck', 'uprightMeaningLabel', v)} />
          <TextField label="逆位牌意标题" value={local.deck.reversedMeaningLabel} onChange={(v) => setNested('deck', 'reversedMeaningLabel', v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField label="大阿卡纳标签" value={local.deck.arcanaMajor} onChange={(v) => setNested('deck', 'arcanaMajor', v)} />
          <TextField label="小阿卡纳标签" value={local.deck.arcanaMinor} onChange={(v) => setNested('deck', 'arcanaMinor', v)} />
        </div>
      </Section>

      {/* 4. 占卜抽牌页 */}
      <Section icon={<Sparkles className="w-5 h-5 text-green-400" />} bg="bg-green-500/20" title="占卜抽牌页" desc="标题、步骤、问题输入、洗牌">
        <TextField label="页面标题" value={local.divine.title} onChange={(v) => setNested('divine', 'title', v)} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <TextField label="步骤1" value={local.divine.steps.select} onChange={(v) => setNested('divine', 'steps', { ...local.divine.steps, select: v } as any)} />
          <TextField label="步骤2" value={local.divine.steps.question} onChange={(v) => setNested('divine', 'steps', { ...local.divine.steps, question: v } as any)} />
          <TextField label="步骤3" value={local.divine.steps.drawing} onChange={(v) => setNested('divine', 'steps', { ...local.divine.steps, drawing: v } as any)} />
          <TextField label="步骤4" value={local.divine.steps.result} onChange={(v) => setNested('divine', 'steps', { ...local.divine.steps, result: v } as any)} />
        </div>
        <TextField label="重新选择牌阵" value={local.divine.reselectSpread} onChange={(v) => setNested('divine', 'reselectSpread', v)} />
        <TextField label="问题标签" value={local.divine.questionLabel} onChange={(v) => setNested('divine', 'questionLabel', v)} />
        <TextField label="问题占位符" value={local.divine.questionPlaceholder} onChange={(v) => setNested('divine', 'questionPlaceholder', v)} />
        <TextField label="抽取张数标签（{n} 替换为数字）" value={local.divine.freeCountLabel} onChange={(v) => setNested('divine', 'freeCountLabel', v)} />
        <TextField label="洗牌按钮文字" value={local.divine.drawButtonText} onChange={(v) => setNested('divine', 'drawButtonText', v)} />
        <TextField label="洗牌动画文案" value={local.divine.shufflingText} onChange={(v) => setNested('divine', 'shufflingText', v)} />
      </Section>

      {/* 5. 历史记录页 */}
      <Section icon={<Clock className="w-5 h-5 text-pink-400" />} bg="bg-pink-500/20" title="历史记录页" desc="标题、空状态、AI 标签">
        <TextField label="页面标题" value={local.history.title} onChange={(v) => setNested('history', 'title', v)} />
        <TextField label="副标题模板（{n} 替换为记录数）" value={local.history.subtitleTemplate} onChange={(v) => setNested('history', 'subtitleTemplate', v)} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="清空按钮" value={local.history.clearButtonText} onChange={(v) => setNested('history', 'clearButtonText', v)} />
          <TextField label="AI 解读标签" value={local.history.aiLabel} onChange={(v) => setNested('history', 'aiLabel', v)} />
        </div>
        <TextField label="清空确认文案" value={local.history.clearConfirm} onChange={(v) => setNested('history', 'clearConfirm', v)} />
        <TextField label="空状态 Emoji（留空隐藏）" value={local.history.emptyEmoji} onChange={(v) => setNested('history', 'emptyEmoji', v)} />
        <TextField label="空状态文字" value={local.history.emptyText} onChange={(v) => setNested('history', 'emptyText', v)} />
        <TextField label="空状态按钮" value={local.history.emptyCta} onChange={(v) => setNested('history', 'emptyCta', v)} />
        <TextField label="无问题占位" value={local.history.noQuestionLabel} onChange={(v) => setNested('history', 'noQuestionLabel', v)} />
      </Section>

      {/* 6. 星空特效 */}
      <Section icon={<Star className="w-5 h-5 text-indigo-400" />} bg="bg-indigo-500/20" title="星空特效" desc="星星数量、颜色、闪烁速度">
        <div className="flex items-center justify-between p-4 bg-purple-500/5 rounded-xl">
          <div>
            <p className="text-white">启用星空</p>
            <p className="text-xs text-purple-300/60">关闭后页面无星空背景</p>
          </div>
          <button
            onClick={() => setNested('starfield', 'enabled', !local.starfield.enabled)}
            className={`w-12 h-7 rounded-full transition-all ${local.starfield.enabled ? 'bg-amber-500' : 'bg-purple-500/30'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mx-1 ${local.starfield.enabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-purple-200">星星密度</label>
            <span className="text-amber-400 font-medium text-sm">{local.starfield.density}</span>
          </div>
          <input
            type="range"
            min="2000"
            max="20000"
            step="500"
            value={local.starfield.density}
            onChange={(e) => setNested('starfield', 'density', Number(e.target.value))}
            className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-xs text-purple-300/50 mt-1">数值越小，星星越多</p>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-purple-200">闪烁速度</label>
            <span className="text-amber-400 font-medium text-sm">{local.starfield.twinkleSpeed.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={local.starfield.twinkleSpeed}
            onChange={(e) => setNested('starfield', 'twinkleSpeed', Number(e.target.value))}
            className="w-full h-2 bg-purple-500/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="星星颜色" value={local.starfield.color} onChange={(v) => setNested('starfield', 'color', v)} />
          <ColorField label="大星光晕" value={local.starfield.glowColor} onChange={(v) => setNested('starfield', 'glowColor', v)} />
        </div>
      </Section>

      {/* 7. 全局背景渐变 */}
      <Section icon={<Palette className="w-5 h-5 text-rose-400" />} bg="bg-rose-500/20" title="全局背景渐变" desc="两处 radial-gradient 颜色">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ColorField label="左上渐变" value={local.background.gradient1} onChange={(v) => setNested('background', 'gradient1', v)} />
          <ColorField label="右下渐变" value={local.background.gradient2} onChange={(v) => setNested('background', 'gradient2', v)} />
        </div>
        <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-500/10">
          <p className="text-[10px] uppercase tracking-wider text-purple-300/50 mb-2">背景预览</p>
          <div
            className="h-24 rounded-lg"
            style={{
              backgroundColor: '#0d0518',
              backgroundImage: `
                radial-gradient(ellipse at 20% 0%, ${local.background.gradient1}, transparent 50%),
                radial-gradient(ellipse at 80% 100%, ${local.background.gradient2}, transparent 50%)
              `,
            }}
          />
          <p className="text-xs text-purple-300/50 mt-2">提示：颜色需用 rgba() 格式（含透明度），如 rgba(157, 78, 221, 0.15)</p>
        </div>
      </Section>
    </div>
  );
}

// ============ 子组件 ============

function Section({ icon, bg, title, desc, children }: { icon: React.ReactNode; bg: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-purple-300/60">{desc}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-purple-300">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-purple-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs text-purple-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-purple-950/50 border border-purple-500/20 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors"
          placeholder="rgba(157, 78, 221, 0.15)"
        />
        <div
          className="w-9 h-9 rounded-lg border border-purple-500/30 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}
