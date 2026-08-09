'use client';

import { useEffect, useState } from 'react';
import { useContent } from '../ContentProvider';

const DISMISS_KEY = 'carrot-announcement-dismissed';

/** 顶部公告条：可由后台配置开关/文案；dismissible 时关掉存 sessionStorage。 */
export function AnnouncementBanner() {
  const { content } = useContent();
  const { announcement } = content;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!announcement.enabled) {
      setVisible(false);
      return;
    }
    // popup 变体不在顶部条显示（留作首屏模态，Phase 3 实现）
    if (announcement.variant !== 'banner') {
      setVisible(false);
      return;
    }
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    setVisible(dismissed !== '1');
  }, [announcement]);

  if (!visible) return null;

  const dismiss = () => {
    if (announcement.dismissible) {
      sessionStorage.setItem(DISMISS_KEY, '1');
      setVisible(false);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-40 bg-[var(--theme-accent)] text-white shadow-md">
      <div className="max-w-5xl mx-auto flex items-center gap-3 px-4 py-2 text-sm">
        <span className="flex-1 font-heading-cn">
          {announcement.title}
          {announcement.body && (
            <span className="font-body opacity-90 ml-2">— {announcement.body}</span>
          )}
        </span>
        {announcement.dismissible && (
          <button
            onClick={dismiss}
            className="shrink-0 w-6 h-6 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors"
            aria-label="关闭公告"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
