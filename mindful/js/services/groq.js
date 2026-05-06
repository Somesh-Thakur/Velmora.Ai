import { API_CONFIG } from "../config/api.js";

export async function streamGroq(prompt, onToken) {
  await streamFromProxy(API_CONFIG.providers.groq.endpoint, {
    model: API_CONFIG.providers.groq.model,
    system: prompt.system,
    messages: prompt.messages
  }, onToken);
}

export async function streamFromProxy(endpoint, payload, onToken) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok || !response.body) {
    throw new Error("Provider unavailable");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      const data = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;
      if (!data || data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const token = parsed.choices?.[0]?.delta?.content ?? parsed.token ?? parsed.content ?? "";
        if (token) onToken(token);
      } catch {
        // Skip lines that are not valid JSON (partial chunks, comments, etc.)
      }
    }
  }
}
