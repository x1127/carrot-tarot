'use client';

import type { StickerConfig } from '@/data/defaultContent';

/**
 * 浮动贴纸层：绝对定位的扁平卡通贴纸，浮于像素背景之上。
 * 贴纸配置来自 theme.stickers（src / 位置 / 浮动参数）。
 * pointer-events: none，不挡交互。
 */
export function FloatingStickers({ stickers }: { stickers: StickerConfig[] }) {
  if (!stickers || stickers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none" aria-hidden>
      {stickers.map((s, i) => (
        <img
          key={i}
          src={s.src}
          alt=""
          className="sticker-float absolute select-none"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: 'auto',
              zIndex: s.zIndex,
              '--float-speed': `${s.floatSpeed}s`,
              '--float-range': `${s.floatRange}px`,
              '--float-delay': `${i * 0.4}s`,
              '--sticker-rot': `${i % 2 === 0 ? -4 : 5}deg`,
              // 贴纸 die-cut 感：drop-shadow 黑边
              filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.85))',
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
