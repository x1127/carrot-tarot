'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '../ContentProvider';

/** 6 项导航（需求文档指定）；历史记录走页脚入口。 */
const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/deck', label: '牌组大全' },
  { href: '/daily', label: '每日一占' },
  { href: '/divine', label: '自定义占卜' },
  { href: '/about', label: '关于我' },
  { href: '/contact', label: '联系方式' },
];

/** 现代暗色半透明胶囊导航，固定右上角；移动端折叠汉堡。 */
export function CapsuleNav() {
  const pathname = usePathname();
  const { content } = useContent();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-4 right-4 z-50">
      {/* 桌面：胶囊横排 */}
      <nav className="capsule-nav hidden md:flex items-center gap-1 rounded-full bg-black/55 border border-white/15 px-2 py-1.5">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              isActive(item.href)
                ? 'bg-[var(--theme-primary)] text-white font-bold'
                : 'text-white/85 hover:bg-white/15'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/admin"
          className="ml-1 px-2.5 py-1.5 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/15 transition-colors"
          title={content.site.adminEntryText}
        >
          ⚙
        </Link>
      </nav>

      {/* 移动：汉堡按钮 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="capsule-nav md:hidden flex flex-col gap-1.5 rounded-full bg-black/55 border border-white/15 p-3"
        aria-label="菜单"
        aria-expanded={open}
      >
        <span className={`block w-5 h-0.5 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>
      {open && (
        <nav className="capsule-nav md:hidden absolute top-14 right-0 flex flex-col gap-1 rounded-3xl bg-black/75 border border-white/15 p-2 min-w-[160px]">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-[var(--theme-primary)] text-white font-bold'
                  : 'text-white/85 hover:bg-white/15'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-full text-xs text-white/60 hover:bg-white/15"
          >
            {content.site.adminEntryText}
          </Link>
        </nav>
      )}
    </header>
  );
}
