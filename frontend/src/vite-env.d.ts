/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * AI 解读 API 的基础地址（Cloudflare Worker）。
   * 生产构建时注入，如 https://api.example.com；
   * 本地开发留空，请求走 Vite 代理到 http://localhost:3001。
   */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
