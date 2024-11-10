import { Wllama } from '@wllama/wllama/esm';

const CONFIG_PATHS = {
  'single-thread/wllama.js': '/wllama/esm/single-thread/wllama.js',
  'single-thread/wllama.wasm': '/wllama/esm/single-thread/wllama.wasm',
  'multi-thread/wllama.js': '/wllama/esm/multi-thread/wllama.js',
  'multi-thread/wllama.wasm': '/wllama/esm/multi-thread/wllama.wasm',
  'multi-thread/wllama.worker.mjs': '/wllama/esm/multi-thread/wllama.worker.mjs',
};

let wllamaInstance: Wllama | null = null;

export async function initWllama(onProgress?: (progress: { loaded: number; total: number }) => void) {
  if (wllamaInstance) return wllamaInstance;

  const wllama = new Wllama(CONFIG_PATHS);

  await wllama.loadModelFromUrl(
    "https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories260K.gguf",
    {
      progressCallback: onProgress,
    }
  );

  wllamaInstance = wllama;
  return wllama;
}

export function getWllama() {
  if (!wllamaInstance) {
    throw new Error('Wllama not initialized');
  }
  return wllamaInstance;
} 