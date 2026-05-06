import { streamFromProxy } from "./groq.js";
import { API_CONFIG } from "../config/api.js";

export async function streamHuggingFace(prompt, onToken) {
  await streamFromProxy(API_CONFIG.providers.huggingface.endpoint, {
    model: API_CONFIG.providers.huggingface.model,
    system: prompt.system,
    messages: prompt.messages
  }, onToken);
}
