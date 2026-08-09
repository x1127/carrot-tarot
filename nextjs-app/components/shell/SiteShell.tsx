'use client';

import { useEffect } from 'react';
import { useContent } from '../ContentProvider';
import { PixelForestBackground } from './PixelForestBackground';
import { FloatingStickers } from './FloatingStickers';
import { CapsuleNav } from './CapsuleNav';
import { AnnouncementBanner } from './AnnouncementBanner';
import { LaptopMockup } from './LaptopMockup';
import { Footer } from './Footer';

/**
 * 站点视觉外壳：像素背景 + 浮动贴纸 + 胶囊导航 + 公告条 + 笔记本容器 + 页脚。
 * 所有页面内容渲染在 LaptopMockup 的屏幕内。
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const { content } = useContent();
  const { theme } = content;

  // 运行时把主题色 / 背景图注入 :root CSS 变量
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primaryColor);
    root.style.setProperty('--theme-accent', theme.accentColor);
    root.style.setProperty('--theme-bg', theme.bgColor);
    root.style.setProperty('--theme-bark', theme.laptopFrameColor);
    if (theme.bgImageUrl) {
      root.style.setProperty('--pixel-bg-url', `url(${theme.bgImageUrl})`);
      root.style.setProperty(
        '--pixel-bg-size',
        theme.bgImageSize === 'cover' ? 'cover' : '256px',
      );
    } else {
      root.style.setProperty('--pixel-bg-url', 'none');
    }

    // 动画开关
    document.body.classList.toggle('no-anim', !theme.enableAnimations);
  }, [theme]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <PixelForestBackground enableDust={theme.enablePixelDust} />
      <FloatingStickers stickers={theme.stickers} />
      <AnnouncementBanner />
      <CapsuleNav />
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-28 pb-16">
        <LaptopMockup>{children}</LaptopMockup>
      </main>
      <Footer />
    </div>
  );
}
