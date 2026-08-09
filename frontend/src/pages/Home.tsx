import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, History, ChevronRight, Settings } from 'lucide-react';
import Navigation from '../components/Navigation';
import StarField from '../components/StarField';
import ModuleIcon from '../components/ModuleIcon';
import { useContent } from '../hooks/useContent';

export default function Home() {
  const navigate = useNavigate();
  const { site, home } = useContent();

  const features = [
    {
      icon: BookOpen,
      iconKey: 'home.feature.deck',
      title: home.features[0]?.title || '牌组图鉴',
      desc: home.features[0]?.desc || '',
      to: '/deck',
    },
    {
      icon: Sparkles,
      iconKey: 'home.feature.divine',
      title: home.features[1]?.title || '立即占卜',
      desc: home.features[1]?.desc || '',
      to: '/divine',
    },
    {
      icon: History,
      iconKey: 'home.feature.history',
      title: home.features[2]?.title || '历史记录',
      desc: home.features[2]?.desc || '',
      to: '/history',
    },
  ];

  return (
    <div className="relative min-h-screen">
      <StarField />
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="relative z-10 text-center max-w-3xl mx-auto pt-16">
          {/* Hero emoji 装饰（可关闭） */}
          {home.heroEmoji && (
            <div className="text-7xl md:text-8xl mb-6 animate-float-slow">{home.heroEmoji}</div>
          )}

          <p className="text-[#d4af37] tracking-[0.4em] text-xs md:text-sm mb-4 uppercase">
            {site.nameEn}
          </p>

          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            <span className="text-gold-gradient">{home.heroTitle}</span>
          </h1>

          <p className="text-[#e8e3f3]/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto whitespace-pre-line">
            {home.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/divine"
              className="px-8 py-3.5 bg-gradient-to-r from-[#9d4edd] to-[#6a2c91] text-white rounded-xl font-medium hover:shadow-xl hover:shadow-[#9d4edd]/40 hover:-translate-y-0.5 transition-all animate-pulse-glow-gold"
            >
              {home.ctaPrimary}
            </Link>
            <Link
              to="/deck"
              className="px-8 py-3.5 glass-card text-[#e8e3f3] rounded-xl font-medium hover:bg-[#2d1b4e]/50 transition-all"
            >
              {home.ctaSecondary}
            </Link>
          </div>

          <p className="mt-12 text-[#e8e3f3]/40 text-sm">
            {home.statsText}
          </p>
        </div>

        {/* 底部渐隐 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0518] to-transparent" />
      </section>

      {/* 功能导航 */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-4">
            <span className="shimmer-text">{home.sectionTitle}</span>
          </h2>
          <p className="text-center text-[#e8e3f3]/50 mb-14">{home.sectionSubtitle}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              return (
                <Link
                  key={f.title}
                  to={f.to}
                  className="group glass-card rounded-2xl p-8 hover:border-[#d4af37]/50 hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#9d4edd]/30 to-[#d4af37]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ModuleIcon name={f.iconKey} fallback={f.icon} size={28} className="text-[#d4af37]" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#e8e3f3] mb-3">
                    {f.title}
                  </h3>
                  <p className="text-[#e8e3f3]/60 text-sm leading-relaxed mb-6">{f.desc}</p>
                  <span className="inline-flex items-center text-[#d4af37] text-sm font-medium">
                    进入 <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="relative z-10 py-10 text-center text-[#e8e3f3]/30 text-sm">
        <p>{site.footerText}</p>
        <button
          onClick={() => navigate('/admin')}
          className="mt-4 inline-flex items-center gap-1 text-[#e8e3f3]/20 hover:text-[#d4af37] transition-colors text-xs"
          title="管理员入口"
        >
          <Settings className="w-3 h-3" />
          {site.adminEntryText}
        </button>
      </footer>
    </div>
  );
}
