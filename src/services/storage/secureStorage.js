import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Encrypted key/value storage for credentials (provider API keys, tokens).
// Never mirror these values into MMKV, Zustand devtools, or logs.
export const SECURE_KEYS = {
  groqApiKey: 'ai_groq_api_key',
  openAiApiKey: 'ai_openai_api_key',
  authToken: 'auth_access_token',
};

const isWeb = Platform.OS === 'web';

export async function getSecureValue(key) {
  return isWeb ? getWebValue(key) : SecureStore.getItemAsync(key);
}

function getWebValue(key) {
  return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
}

function setWebValue(key, value) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function deleteWebValue(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}

export async function setSecureValue(key, value) {
  if (!value) {
    return deleteSecureValue(key);
  }
  if (isWeb) {
    setWebValue(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

export async function deleteSecureValue(key) {
  if (isWeb) {
    deleteWebValue(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}
