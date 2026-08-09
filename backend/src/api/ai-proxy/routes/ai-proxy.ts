export default {
  routes: [
    {
      method: 'POST',
      path: '/ai-proxy/interpret',
      handler: 'ai-proxy.interpret',
      config: {
        // 公开端点：请求体不含 API Key，Key 由服务器从 ai-config 读取
        auth: false,
        policies: [],
        // 速率限制：按 IP 限流，防止匿名滥用导致 API Key 被过度调用
        // 阈值由 RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX 环境变量控制，默认 5 次/分钟
        middlewares: ['global::rate-limit'],
      },
    },
  ],
};
