const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

// Hits Groq's /models endpoint as a lightweight auth check — cheaper than a real
// chat completion and doesn't burn the user's token quota just to validate a key.
export async function testGroqConnection(apiKey) {
  if (!apiKey) {
    return { ok: false, message: 'Enter an API key first.' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${GROQ_BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.status === 401) {
      return { ok: false, message: 'Invalid API key.' };
    }
    if (!response.ok) {
      return { ok: false, message: `Groq returned an error (${response.status}).` };
    }

    const data = await response.json();
    return { ok: true, message: 'Connected', modelCount: data?.data?.length ?? 0 };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { ok: false, message: 'Request timed out.' };
    }
    return { ok: false, message: 'Could not reach Groq. Check your connection.' };
  }
}
