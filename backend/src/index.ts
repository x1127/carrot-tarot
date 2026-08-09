import fs from 'fs';
import path from 'path';

export default {
  /**
   * 注册钩子（应用初始化前）。
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * 引导钩子：
   * 1. 配置 Public 角色权限（幂等，每次启动确保前端可读公开内容）
   * 2. 从 scripts/seed-data.json 导入 78 牌 + 4 牌阵（仅表空时）
   * 3. Upsert 站点内容 / 主题配置 / AI 配置（幂等，每次启动确保存在）
   */
  async bootstrap({ strapi }: { strapi: any }) {
    await setupPublicPermissions(strapi);

    const seedPath = path.join(process.cwd(), 'scripts', 'seed-data.json');
    let seed: any = null;
    if (fs.existsSync(seedPath)) {
      seed = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    } else {
      strapi.log.warn(`Seed: ${seedPath} not found.`);
    }

    // 78 张牌 + 4 牌阵：仅在表空时导入
    const cardCount = await strapi.db.query('api::card.card').count({});
    if (cardCount > 0) {
      strapi.log.info(`Seed: ${cardCount} cards already present, skipping card/spread seed.`);
    } else if (seed) {
      strapi.log.info(`Seed: importing ${seed.cards.length} cards, ${seed.spreads.length} spreads...`);
      for (const card of seed.cards) {
        await strapi.entityService.create('api::card.card', { data: card });
      }
      for (const spread of seed.spreads) {
        await strapi.entityService.create('api::spread.spread', { data: spread });
      }
      strapi.log.info('Seed: cards & spreads imported ✓');
    }

    // 单一类型：upsert（幂等，每次启动确保存在，缺失则从 seed 补）
    if (seed) {
      await upsertSingleType(strapi, 'api::site-content.site-content', seed.siteContent);
      await upsertSingleType(strapi, 'api::theme-config.theme-config', seed.themeConfig);
      await upsertSingleType(strapi, 'api::ai-config.ai-config', seed.aiConfig);
    }

    strapi.log.info('Bootstrap: complete ✓');
  },
};

/**
 * 配置 Public 角色的 API 读取权限（幂等）。
 * 允许匿名访问公开内容类型；ai-config 全禁（key 不出 Strapi 进程）。
 */
async function setupPublicPermissions(strapi: any) {
  const publicActions = [
    'api::card.card.find',
    'api::card.card.findOne',
    'api::spread.spread.find',
    'api::spread.spread.findOne',
    'api::site-content.site-content.find',
    'api::theme-config.theme-config.find',
    'api::announcement.announcement.find',
    'api::announcement.announcement.findOne',
    'api::message.message.create',
  ];

  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });
  if (!publicRole) {
    strapi.log.warn('Permissions: Public role not found, skipping.');
    return;
  }

  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: publicRole.id } });
  const existingActions = new Set(existing.map((p: any) => p.action));

  let added = 0;
  for (const action of publicActions) {
    if (!existingActions.has(action)) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
      added += 1;
    }
  }
  strapi.log.info(`Permissions: Public role has ${existingActions.size + added} actions (${added} added).`);
}

/**
 * 单一类型 upsert：存在则更新，不存在则创建。
 */
async function upsertSingleType(strapi: any, uid: string, data: any) {
  const existing = await strapi.db.query(uid).findOne({});
  if (existing) {
    await strapi.entityService.update(uid, existing.id, { data });
  } else {
    await strapi.entityService.create(uid, { data });
  }
}
