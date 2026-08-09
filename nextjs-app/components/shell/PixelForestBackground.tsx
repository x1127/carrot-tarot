'use client';

import { useEffect, useState } from 'react';

interface Dust {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

/**
 * 16-bit 像素森林平铺背景 + 漂浮像素尘埃粒子。
 * 背景图 URL 与主题色由 SiteShell 注入 :root 变量，此处只负责层级与粒子。
 * 尘埃用 Math.random 生成，故只在挂载后（client-only）生成，避免 hydration 不匹配。
 */
export function PixelForestBackground({ enableDust = true }: { enableDust?: boolean }) {
  const [dust, setDust] = useState<Dust[]>([]);

  useEffect(() => {
    if (!enableDust) {
      setDust([]);
      return;
    }
    const colors = ['#ffd54f', '#fff8e7', '#b3e5fc', '#7cb342'];
    setDust(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 60,
        color: colors[i % 4],
      })),
    );
  }, [enableDust]);

  return (
    <>
      <div className="pixel-bg-layer" aria-hidden />
      {dust.length > 0 && (
        <div className="pixel-dust-layer" aria-hidden>
          {dust.map((d) => (
            <span
              key={d.id}
              className="pixel-dust"
              style={
                {
                  left: `${d.left}%`,
                  width: `${d.size}px`,
                  height: `${d.size}px`,
                  background: d.color,
                  '--dust-duration': `${d.duration}s`,
                  '--dust-delay': `${d.delay}s`,
                  '--dust-drift': `${d.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
