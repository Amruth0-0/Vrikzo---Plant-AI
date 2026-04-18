/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Node.js backend (e.g. http://localhost:5000) */
  readonly VITE_API_URL?: string;
  /** Direct URL of the Python Flask CNN API (e.g. http://127.0.0.1:8000) */
  readonly VITE_PREDICT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
