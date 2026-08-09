'use client';

import Link from 'next/link';
import { useContent } from '@/components/ContentProvider';

/** 首页：Hero + 功能卡片，全部显示在笔记本屏幕内。 */
export default function HomePage() {
  const { content } = useContent();
  const { home, site } = content;

  return (
    <div className="p-6 sm:p-10 min-h-[420px] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
        {home.heroEmoji && (
          <span className="text-6xl mb-3 inline-block animate-bounce" style={{ animationDuration: '2s' }}>
            {home.heroEmoji}
          </span>
        )}
        <h1 className="font-heading-cn text-4xl sm:text-5xl text-[var(--theme-primary)] mb-3 drop-shadow-[2px_2px_0_var(--theme-bark)]">
          {home.heroTitle}
        </h1>
        <p className="font-logo text-xs tracking-[0.3em] text-[var(--theme-bark)]/60 mb-4">
          {site.nameEn.toUpperCase()}
        </p>
        <p className="font-body text-sm text-[var(--theme-bark)] whitespace-pre-line max-w-md mb-6">
          {home.heroSubtitle}
        </p>
        <div className="flex gap-3">
          <Link href="/daily" className="pixel-btn rounded-xl bg-[var(--theme-primary)] text-white px-5 py-2.5 text-sm">
            {home.ctaPrimary}
          </Link>
          <Link href="/deck" className="pixel-btn rounded-xl bg-[var(--color-cream)] text-[var(--theme-bark)] px-5 py-2.5 text-sm">
            {home.ctaSecondary}
          </Link>
        </div>
        <p className="font-body text-xs text-[var(--theme-bark)]/60 mt-6">{home.statsText}</p>
      </section>

      {/* 功能卡片 */}
      <section className="py-6 border-t-2 border-dashed border-[var(--theme-bark)]/25">
        <h2 className="font-heading-cn text-xl text-center text-[var(--theme-bark)] mb-1">
          {home.sectionTitle}
        </h2>
        <p className="font-body text-xs text-center text-[var(--theme-bark)]/60 mb-4">
          {home.sectionSubtitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {home.features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border-2 border-[var(--theme-bark)] bg-[var(--color-cream)] p-4 text-center hover:-translate-y-1 transition-transform"
            >
              <span className="text-3xl block mb-2">{f.emoji}</span>
              <h3 className="font-heading-cn text-base text-[var(--theme-primary)] mb-1">
                {f.title}
              </h3>
              <p className="font-body text-xs text-[var(--theme-bark)]/80 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
