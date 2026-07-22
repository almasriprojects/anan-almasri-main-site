/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_CHAT_URL?: string;
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
