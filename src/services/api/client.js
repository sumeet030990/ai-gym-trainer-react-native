import { router } from 'expo-router';
import { API_BASE_URL } from '../../constants/api';
import { SECURE_KEYS, getSecureValue } from '../storage/secureStorage';
import { useAuthStore } from '../../store/authStore';

const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please log in again.';

// Several queries can 401 at once when a token expires; only the first one
// should tear down the session and navigate.
let isHandlingUnauthorized = false;

async function handleUnauthorized() {
  if (isHandlingUnauthorized || !useAuthStore.getState().isAuthenticated) return;
  isHandlingUnauthorized = true;
  try {
    await useAuthStore.getState().logout();
    router.replace('/login');
  } finally {
    isHandlingUnauthorized = false;
  }
}

// Same response envelope as auth.api.js's postJson: { success, status_code, data, error: { detail } | null }.
// This variant attaches the JWT from SecureStore, for every route that isn't /login or /register.
// A 401 means the JWT is missing/expired/revoked, so the user is logged out and sent to /login.
export async function authorizedFetch(path, { method = 'GET', body } = {}) {
  try {
    const token = await getSecureValue(SECURE_KEYS.authToken);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      await handleUnauthorized();
      return { ok: false, status: 401, message: SESSION_EXPIRED_MESSAGE };
    }

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, message: responseBody?.error?.detail ?? 'Something went wrong. Please try again.' };
    }
    return { ok: true, data: responseBody?.data };
  } catch {
    return { ok: false, message: 'Could not reach the server. Check your connection.' };
  }
}
