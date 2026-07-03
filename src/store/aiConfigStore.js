import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage/mmkv';
import { SECURE_KEYS, getSecureValue, setSecureValue, deleteSecureValue } from '../services/storage/secureStorage';

// The API key itself never lands in this store's state (and therefore never in MMKV
// or the persisted snapshot) — only `hasApiKey` does. Read the real value on demand
// from secureStorage right before it's needed (e.g. an outgoing request).
const AI_CONFIG_DEFAULTS = {
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  maxTokens: 1024,
  hasApiKey: false,
};

export const useAIConfigStore = create(
  persist(
    (set) => ({
      ...AI_CONFIG_DEFAULTS,

      updateConfig: (fields) => set((state) => ({ ...state, ...fields })),

      hydrateApiKeyStatus: async () => {
        const key = await getSecureValue(SECURE_KEYS.groqApiKey);
        set({ hasApiKey: Boolean(key) });
      },

      saveApiKey: async (value) => {
        await setSecureValue(SECURE_KEYS.groqApiKey, value);
        set({ hasApiKey: Boolean(value) });
      },

      clearApiKey: async () => {
        await deleteSecureValue(SECURE_KEYS.groqApiKey);
        set({ hasApiKey: false });
      },
    }),
    {
      name: 'ai-config-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        provider: state.provider,
        model: state.model,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
      }),
    }
  )
);
