import { MMKV } from 'react-native-mmkv';

// General-purpose key/value store for non-secret app state (settings, profile, goals).
// Never put credentials or API keys here — use services/storage/secureStorage.js.
export const storage = new MMKV({ id: 'app-storage' });

// Adapter so zustand's persist middleware can read/write through MMKV synchronously.
export const mmkvStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
};
