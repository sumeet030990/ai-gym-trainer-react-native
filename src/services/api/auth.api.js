import { API_BASE_URL } from '../../constants/api';

// Responses are wrapped by the backend's response middleware as
// { success, status_code, data, error: { detail } | null }.
async function postJson(path, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, message: body?.error?.detail ?? 'Something went wrong. Please try again.' };
    }
    return { ok: true, data: body?.data };
  } catch {
    return { ok: false, message: 'Could not reach the server. Check your connection.' };
  }
}

// `userName` accepts either an email or a mobile number — the backend looks up either.
export function loginRequest(userName, password) {
  return postJson('/login', { user_name: userName, password });
}

export function registerRequest({ mobileNo, password, email, firstName, lastName }) {
  return postJson('/register', {
    mobile_no: mobileNo,
    password,
    email: email || undefined,
    first_name: firstName || undefined,
    last_name: lastName || undefined,
  });
}
