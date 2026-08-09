'use client';

import Link from 'next/link';
import { useContent } from '../ContentProvider';

/** 页脚：站点名 / 页脚文案 / 历史记录入口（需求文档要求历史走页脚）。 */
export function Footer() {
  const { content } = useContent();
  const { site } = content;

  return (
    <footer className="relative z-10 border-t-2 border-[var(--theme-bark)]/30 bg-[var(--theme-bg)]/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="font-heading-cn text-lg text-[var(--theme-primary)]">{site.name}</p>
          <p className="font-logo text-xs text-[var(--theme-bark)]/70 tracking-widest">
            {site.nameEn}
          </p>
        </div>
        <p className="font-body text-xs text-[var(--theme-bark)]/80 text-center">
          {site.footerText}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="font-body text-xs text-[var(--theme-bark)]/70 hover:text-[var(--theme-primary)] transition-colors"
          >
            📜 {site.historyEntryText}
          </Link>
          <Link
            href="/admin"
            className="font-body text-xs text-[var(--theme-bark)]/50 hover:text-[var(--theme-primary)] transition-colors"
          >
            ⚙ {site.adminEntryText}
          </Link>
        </div>
      </div>
    </footer>
  );
}
