'use client';

import { defaultContent } from '../data/defaultContent';
import type { SiteContent } from '../data/defaultContent';

const STORAGE_KEY = 'carrot-tarot-content';

// 深合并：默认值优先，localStorage 覆盖（只覆盖已存在的键）
function deepMerge<T>(base: T, override: unknown): T {
  if (base === null || typeof base !== 'object') return base;
  if (override === null || typeof override !== 'object') return base;
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    merged[key] = b && typeof b === 'object' ? deepMerge(b, o) : o;
  }
  return merged as T;
}

export function loadContent(): SiteContent {
  if (typeof window === 'undefined') return defaultContent;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    return deepMerge(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

export function saveContent(content: Partial<SiteContent>): SiteContent {
  if (typeof window === 'undefined') return defaultContent;
  const current = loadContent();
  const merged = deepMerge(current, content);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // 忽略配额错误
  }
  return merged;
}

export function resetContent(): SiteContent {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return defaultContent;
}

export { STORAGE_KEY, defaultContent };
export type { SiteContent };
