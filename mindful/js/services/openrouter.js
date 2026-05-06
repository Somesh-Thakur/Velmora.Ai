import { streamFromProxy } from "./groq.js";
import { API_CONFIG } from "../config/api.js";

export async function streamOpenRouter(prompt, onToken) {
  await streamFromProxy(API_CONFIG.providers.openrouter.endpoint, {
    model: API_CONFIG.providers.openrouter.model,
    system: prompt.system,
    messages: prompt.messages
  }, onToken);
}
