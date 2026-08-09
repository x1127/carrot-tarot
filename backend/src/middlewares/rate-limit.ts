/**
 * 全局自定义中间件：固定窗口速率限制（按 IP）
 *
 * 用于保护公开端点（如 /api/ai-proxy/interpret），防止匿名滥用导致
 * 上游 LLM API Key 被过度调用产生费用。
 *
 * 引用方式：在路由 config.middlewares 中加入 'global::rate-limit'。
 *
 * 配置（环境变量，可选）：
 *   RATE_LIMIT_WINDOW_MS  窗口时长，默认 60000（60s）
 *   RATE_LIMIT_MAX        窗口内最大请求数，默认 5
 *
 * 实现：内存 Map 存储 { count, resetAt }，单实例足够。
 * 多实例部署应替换为 Redis 共享存储。
 */

const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 5;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// 周期性清理过期桶，避免内存无限增长
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

// 解析客户端真实 IP：优先取 X-Forwarded-For 首段，回退 ctx.ip
function getClientIp(ctx: any): string {
  const xff = ctx.request?.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim();
  }
  return ctx.request?.ip || ctx.ip || 'unknown';
}

export default () => {
  return (ctx: any, next: any) => {
    const now = Date.now();
    cleanup(now);

    const ip = getClientIp(ctx);
    const bucket = buckets.get(ip);

    if (!bucket || bucket.resetAt <= now) {
      // 新窗口
      buckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return next();
    }

    bucket.count += 1;
    if (bucket.count > RATE_LIMIT_MAX) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      ctx.status = 429;
      ctx.set('Retry-After', String(retryAfter));
      ctx.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
      ctx.set('X-RateLimit-Remaining', '0');
      ctx.set('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));
      ctx.body = {
        error: {
          status: 429,
          name: 'RateLimitExceeded',
          message: `请求过于频繁，请 ${retryAfter} 秒后重试。`,
          details: { limit: RATE_LIMIT_MAX, windowMs: RATE_LIMIT_WINDOW_MS },
        },
      };
      return;
    }

    ctx.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
    ctx.set('X-RateLimit-Remaining', String(Math.max(0, RATE_LIMIT_MAX - bucket.count)));
    ctx.set('X-RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    return next();
  };
};
