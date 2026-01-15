// AI Configuration
export const AI_MODEL = "gpt-4o";
export const LS_API_KEY = "ost_openai_api_key";

// Model Management Storage Keys
export const API_KEYS_STORAGE_KEY = "ost-api-keys"; // { modelId: apiKey }
export const MODEL_ID_STORAGE_KEY = "ost-model-id";
export const CUSTOM_MODEL_ID_STORAGE_KEY = "ost-custom-model-id";

// Node sizing (auto-height)
export const NODE_W = 320;
export const MIN_NODE_H = 70;
export const PAD_X = 18;
export const PAD_Y = 16;
export const LINE_H = 16;
export const MAX_CHARS_PER_LINE = 38;

// Layout constants
export const X_GAP = 360;
export const Y_GAP = 180;
export const INITIAL_TRANSFORM = { x: 40, y: 40, s: 1 };

// AI Generation Retry Configuration
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY_MS = 1000; // Delay between retries in milliseconds
