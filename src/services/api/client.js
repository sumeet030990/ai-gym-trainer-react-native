import { API_BASE_URL } from '../../constants/api';
import { SECURE_KEYS, getSecureValue } from '../storage/secureStorage';

// Same response envelope as auth.api.js's postJson: { success, status_code, data, error: { detail } | null }.
// This variant attaches the JWT from SecureStore, for every route that isn't /login or /register.
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
    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, message: responseBody?.error?.detail ?? 'Something went wrong. Please try again.' };
    }
    return { ok: true, data: responseBody?.data };
  } catch {
    return { ok: false, message: 'Could not reach the server. Check your connection.' };
  }
}
