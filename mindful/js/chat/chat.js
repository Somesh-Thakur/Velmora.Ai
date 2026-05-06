import { findMode } from "./modes.js";
import { composerTemplate, emptyStateTemplate } from "./templates.js";
import { renderMessages, bindMessageActions, typingTemplate } from "./messages.js";
import { buildPrompt } from "./prompts.js";
import { renderMarkdown } from "../markdown.js";
import { bindCustomSelects } from "../dropdown.js";
import { storage } from "../storage.js";
import { addMessage, getActiveConversation, getActiveConversationId, updateConversation } from "../history.js";
import { streamVelmoraResponse } from "./streaming.js";
import { showToast } from "../toast.js";

const MODE_KEY = "velmora.activeMode";
let rootElement = null;
let refreshCallback = null;
let isStreaming = false;

export function getActiveMode() {
  return storage.get(MODE_KEY, "auto");
}

export function setMode(mode) {
  storage.set(MODE_KEY, mode);
  const active = getActiveConversation();
  if (active) {
    updateConversation(active.id, conversation => ({ ...conversation, mode }));
  }
}

export function initChat(root, onRefresh) {
  rootElement = root;
  refreshCallback = onRefresh;
  renderChat();
}

function renderChat() {
  const conversation = getActiveConversation();
  const mode = findMode(conversation?.mode || getActiveMode());

  rootElement.innerHTML = `
    <div id="chat-scroll-area">
      ${conversation?.messages.length ? renderMessages(conversation.messages) : emptyStateTemplate(mode)}
    </div>
    <div class="composer-wrap">
      ${composerTemplate(mode)}
    </div>
  `;

  bindComposer(mode);
  bindMessageActions(rootElement, regenerate);
  scrollToBottom(false);
}

function bindComposer(mode) {
  const form = rootElement.querySelector("#composer-form");
  const input = rootElement.querySelector("#composer-input");
  const send = rootElement.querySelector("#send-button");
  const modeSelect = rootElement.querySelector("#mode-select");

  bindCustomSelects(rootElement, event => {
    if (event.id === "mode-select") {
      setMode(event.value);
      refreshCallback();
    }
  });

  input.addEventListener("input", () => {
    send.disabled = !input.value.trim() || isStreaming;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 210)}px`;
  });

  input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      input.value = "";
      input.dispatchEvent(new Event("input"));
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const content = input.value.trim();
    if (!content || isStreaming) return;
    const selectedMode = modeSelect.value;
    input.value = "";
    input.dispatchEvent(new Event("input"));
    sendMessage(content, selectedMode);
  });
}

async function sendMessage(content, modeId) {
  const conversationId = getActiveConversationId();
  addMessage(conversationId, { role: "user", content });
  refreshCallback();
  await streamAssistant(conversationId, modeId);
}

async function streamAssistant(conversationId, modeId) {
  isStreaming = true;
  const conversation = getActiveConversation();
  const stream = rootElement.querySelector("#message-stream");
  if (stream) {
    stream.insertAdjacentHTML("beforeend", typingTemplate());
    scrollToBottom();
  }

  const prompt = buildPrompt({ modeId, messages: conversation.messages });
  let content = "";
  const typing = rootElement.querySelector("#typing-message");
  const body = typing?.querySelector(".message-body");

  try {
    const provider = await streamVelmoraResponse(prompt, token => {
      content += token;
      if (body) {
        body.dataset.raw = encodeURIComponent(content);
        body.innerHTML = renderMarkdown(content);
      }
      scrollToBottom();
    });

    typing?.remove();
    addMessage(conversationId, { role: "assistant", content, provider });
    showToast(provider === "local" ? "Offline response generated" : `Response from ${provider}`);
  } finally {
    isStreaming = false;
    refreshCallback();
  }
}

async function regenerate() {
  const conversation = getActiveConversation();
  if (!conversation || isStreaming) return;
  const messages = conversation.messages;
  const lastAssistantIndex = messages.map(message => message.role).lastIndexOf("assistant");
  if (lastAssistantIndex < 0) return;

  updateConversation(conversation.id, item => ({
    ...item,
    messages: item.messages.slice(0, lastAssistantIndex)
  }));
  refreshCallback();

  const modeId = conversation.mode || getActiveMode();
  const prompt = buildPrompt({ modeId, messages: getActiveConversation().messages });
  let content = "";
  isStreaming = true;
  const stream = rootElement.querySelector("#message-stream");
  stream?.insertAdjacentHTML("beforeend", typingTemplate());
  const body = rootElement.querySelector("#typing-message .message-body");

  try {
    await streamVelmoraResponse(prompt, token => {
      content += token;
      body.innerHTML = renderMarkdown(content);
      scrollToBottom();
    });
    rootElement.querySelector("#typing-message")?.remove();
    addMessage(conversation.id, { role: "assistant", content });
  } finally {
    isStreaming = false;
    refreshCallback();
  }
}

function scrollToBottom(smooth = true) {
  requestAnimationFrame(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: smooth ? "smooth" : "auto"
    });
  });
}
