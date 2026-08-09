import { useEffect, useRef } from 'react';
import { useAdminConfigStore } from '../store/adminConfig';

// 星空粒子背景，全屏固定定位
// 参数由管理后台「内容设置 → 星空特效」控制
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starfield = useAdminConfigStore((s) => s.config.siteContent.starfield);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 关闭星空：直接清空并退出
    if (!starfield.enabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationId = 0;
    let stars: { x: number; y: number; z: number; size: number; twinkle: number }[] = [];

    // hex -> rgb 转换，便于构造 rgba()
    const hexToRgb = (hex: string) => {
      const h = hex.replace('#', '');
      const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
      const n = parseInt(v, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };
    const starRgb = hexToRgb(starfield.color);
    const glowRgb = hexToRgb(starfield.glowColor);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(160, Math.floor((canvas.width * canvas.height) / Math.max(1000, starfield.density)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() * 1.6 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const speed = Math.max(0.1, starfield.twinkleSpeed);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() / 1000;
      for (const s of stars) {
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.z * speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRgb.r}, ${starRgb.g}, ${starRgb.b}, ${alpha})`;
        ctx.fill();
        if (s.size > 1.2) {
          ctx.fillStyle = `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [starfield.enabled, starfield.density, starfield.color, starfield.glowColor, starfield.twinkleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
