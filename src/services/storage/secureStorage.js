import * as SecureStore from 'expo-secure-store';

// Encrypted key/value storage for credentials (provider API keys, tokens).
// Never mirror these values into MMKV, Zustand devtools, or logs.
export const SECURE_KEYS = {
  groqApiKey: 'ai_groq_api_key',
  openAiApiKey: 'ai_openai_api_key',
};

export async function getSecureValue(key) {
  return SecureStore.getItemAsync(key);
}

export async function setSecureValue(key, value) {
  if (!value) {
    return SecureStore.deleteItemAsync(key);
  }
  return SecureStore.setItemAsync(key, value);
}

export async function deleteSecureValue(key) {
  return SecureStore.deleteItemAsync(key);
}
