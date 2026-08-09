'use client';

/**
 * 打开的笔记本电脑 Mockup：页面功能区显示在屏幕内。
 * CSS 绘制外框（梯形顶盖 + 圆角屏幕 + 阴影 + 铰链），children 作屏幕内容。
 */
export function LaptopMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="laptop-mockup w-full">
      {/* 屏幕 */}
      <div className="laptop-screen">
        <span className="laptop-notch" />
        <div className="laptop-screen-inner">{children}</div>
      </div>
      {/* 底座 */}
      <div className="laptop-base">
        <div className="laptop-hinge" />
      </div>
    </div>
  );
}
