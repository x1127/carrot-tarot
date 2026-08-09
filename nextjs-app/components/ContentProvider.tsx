'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { defaultContent, loadContent, saveContent } from '../lib/content-store';
import type { SiteContent } from '../data/defaultContent';

interface ContentContextValue {
  content: SiteContent;
  update: (partial: Partial<SiteContent>) => void;
}

const ContentContext = createContext<ContentContextValue>({
  content: defaultContent,
  update: () => {},
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  // 首屏用默认值（SSR 一致），挂载后读 localStorage 覆盖
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    setContent(loadContent());
  }, []);

  const update = useCallback((partial: Partial<SiteContent>) => {
    setContent((prev) => {
      const next = saveContent(partial);
      return next;
    });
  }, []);

  return (
    <ContentContext.Provider value={{ content, update }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
