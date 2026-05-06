import { streamGroq } from "../services/groq.js";
import { streamOpenRouter } from "../services/openrouter.js";
import { streamHuggingFace } from "../services/huggingface.js";
import { getSettings } from "../settings.js";
import { delay } from "../typing.js";

const providers = {
  groq: streamGroq,
  openrouter: streamOpenRouter,
  huggingface: streamHuggingFace
};

export async function streamVelmoraResponse(prompt, onToken) {
  const settings = getSettings();
  const order = settings.provider === "auto"
    ? ["groq", "openrouter", "huggingface"]
    : [settings.provider];

  for (const provider of order) {
    try {
      let received = false;
      await providers[provider](prompt, token => {
        received = true;
        onToken(token);
      });
      if (received) return provider;
    } catch {
      continue;
    }
  }

  const fallback = localResponse(prompt);
  for (const token of fallback.split(/(\s+)/)) {
    onToken(token);
    await delay(token.trim() ? 20 : 4);
  }
  return "local";
}

function localResponse(prompt) {
  const latest = prompt.messages[prompt.messages.length - 1]?.content || "the situation";
  return `I would handle this as a real situation, not a thought loop.

**What seems clear**
- There is a specific moment that needs a practical next step.
- The goal is not to win the exchange. The goal is to reduce confusion and create a cleaner conversation.
- You should avoid sending a message while you are still trying to discharge emotion.

**What to do next**
- Write one sentence that names the observable issue.
- Add one sentence that shows you are open to being wrong.
- Ask one direct question that gives the other person room to clarify.
- Do not add a long defense unless they ask for context.

**Message you can send**
"I might be reading this wrong, but I sensed some distance after what happened. I care about keeping things clear between us. Are we okay, or is there something I should understand?"

**Why this works**
It is calm, specific, and non-accusatory. It opens the door without forcing the other person to admit fault.

Context I used: ${latest.slice(0, 180)}`;
}
