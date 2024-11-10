// Importing types only to avoid direct dependency
type WllamaConfig = {
  'single-thread/wllama.js': string;
  'single-thread/wllama.wasm': string;
  'multi-thread/wllama.js': string;
  'multi-thread/wllama.wasm': string;
  'multi-thread/wllama.worker.mjs': string;
};

type WllamaInstance = {
  createCompletion: (prompt: string, options: any) => Promise<string>;
  loadModelFromUrl: (url: string, options: any) => Promise<void>;
  setOptions: (options: any) => Promise<void>;
  exit: () => Promise<void>;
};

// Configuration paths for WASM and worker files
const CONFIG_PATHS: WllamaConfig = {
  'single-thread/wllama.js': '/wllama/esm/single-thread/wllama.js',
  'single-thread/wllama.wasm': '/wllama/esm/single-thread/wllama.wasm',
  'multi-thread/wllama.js': '/wllama/esm/multi-thread/wllama.js',
  'multi-thread/wllama.wasm': '/wllama/esm/multi-thread/wllama.wasm',
  'multi-thread/wllama.worker.mjs': '/wllama/esm/multi-thread/wllama.worker.mjs',
};

// Use a smaller model for faster loading
const MODEL_URL = 'https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct-GGUF/resolve/main/smollm2-360m-instruct-q8_0.gguf?download=true';

let wllamaInstance: WllamaInstance | null = null;

export async function initWllama(onProgress?: (progress: { loaded: number; total: number }) => void) {
  if (wllamaInstance) return wllamaInstance;

  try {
    // Dynamic import with error handling
    let Wllama;
    try {
      const module = await import('@wllama/wllama');
      Wllama = module.Wllama;
    } catch (importError) {
      console.error('Failed to import from package, trying public path:', importError);
      const module = await import('/wllama/esm/index.js');
      Wllama = module.Wllama;
    }

    if (!Wllama) {
      throw new Error('Failed to import Wllama module');
    }

    const wllama = new Wllama(CONFIG_PATHS);

    // Load the model first with basic configuration
    await wllama.loadModelFromUrl(MODEL_URL, {
      progressCallback: onProgress,
      n_threads: navigator.hardwareConcurrency || 4,
      n_ctx: 512,
      embeddings: false,
      use_gpu: false,
    });

    // Then set additional options
    await wllama.setOptions({
      temp: 0.7,
      top_k: 40,
      top_p: 0.9,
      repeat_penalty: 1.1,
      batch_size: 512,
    });

    wllamaInstance = wllama;
    return wllama;
  } catch (error) {
    console.error('Failed to initialize Wllama:', error);
    throw error;
  }
}

export async function createCompletion(prompt: string, options: any = {}) {
  const wllama = await getWllama();
  try {
    return await wllama.createCompletion(prompt, {
      n_predict: options.maxTokens || 2048,
      stop: options.stopPrompts || ['</s>', 'User:', 'Assistant:'],
      temp: options.temperature || 0.7,
      top_k: options.topK || 40,
      top_p: options.topP || 0.9,
      repeat_penalty: options.repeatPenalty || 1.1,
      ...options,
    });
  } catch (error) {
    console.error('Error in completion:', error);
    throw error;
  }
}

export async function cleanup() {
  if (wllamaInstance) {
    await wllamaInstance.exit();
    wllamaInstance = null;
  }
}

export function getWllama() {
  if (!wllamaInstance) {
    throw new Error('Wllama not initialized. Call initWllama() first.');
  }
  return wllamaInstance;
}

// Add a check for browser environment
export function isWllamaSupported() {
  return typeof window !== 'undefined' && 
         'WebAssembly' in window && 
         'Worker' in window;
} 