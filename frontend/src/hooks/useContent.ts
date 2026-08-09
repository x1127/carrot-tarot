import { useAdminConfigStore } from '../store/adminConfig';
import { defaultContent } from '../data/defaultContent';
import type { SiteContent } from '../data/defaultContent';

/**
 * 读取全站内容配置的前台 hook。
 * - 返回的 content 保证每个字段都有值（缺失时回落到 defaultContent）。
 * - 修改内容请使用管理后台的「内容设置」页面，调用 store.updateContent()。
 *
 * 后期新增页面时：
 *   1. 在 defaultContent.ts 追加该页面的字段定义与默认值
 *   2. 在 useContent 的 deepMerge 中追加该 key 的合并
 *   3. 前台页面用 const { 新页面 } = useContent() 读取
 */
export function useContent(): SiteContent {
  const stored = useAdminConfigStore((s) => s.config.siteContent);

  // 浅合并顶层 key，保证新增字段也有默认值
  return {
    site: { ...defaultContent.site, ...stored.site },
    home: {
      ...defaultContent.home,
      ...stored.home,
      features: stored.home?.features?.length
        ? stored.home.features
        : defaultContent.home.features,
    },
    deck: {
      ...defaultContent.deck,
      ...stored.deck,
      filters: { ...defaultContent.deck.filters, ...(stored.deck?.filters || {}) },
    },
    divine: {
      ...defaultContent.divine,
      ...stored.divine,
      steps: { ...defaultContent.divine.steps, ...(stored.divine?.steps || {}) },
    },
    history: { ...defaultContent.history, ...stored.history },
    starfield: { ...defaultContent.starfield, ...stored.starfield },
    background: { ...defaultContent.background, ...stored.background },
  };
}
