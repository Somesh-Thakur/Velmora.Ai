import { renderMarkdown } from "../markdown.js";
import { icon } from "../modal.js";
import { showToast } from "../toast.js";

export function renderMessages(messages) {
  return `
    <section class="message-stream" id="message-stream">
      ${messages.map(messageTemplate).join("")}
    </section>
  `;
}

export function messageTemplate(message) {
  const isAssistant = message.role === "assistant";
  return `
    <article class="message ${isAssistant ? "assistant" : "user"}" data-message-id="${message.id || ""}">
      <div class="message-avatar">${isAssistant ? "AI" : "ME"}</div>
      <div class="message-content">
        <div class="message-meta">
          <span class="message-name">${isAssistant ? "Velmora.Ai" : "You"}</span>
          <div class="message-actions">
            <button class="message-action" data-copy aria-label="Copy message">${icon("copy")}</button>
            ${isAssistant ? `<button class="message-action" data-regenerate aria-label="Regenerate response">${icon("refresh")}</button>` : ""}
          </div>
        </div>
        <div class="message-body" data-message-body data-raw="${encodeURIComponent(message.content)}">${renderMarkdown(message.content)}</div>
      </div>
    </article>
  `;
}

export function bindMessageActions(root, onRegenerate) {
  root.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async event => {
      const body = event.currentTarget.closest(".message").querySelector("[data-message-body]");
      await navigator.clipboard.writeText(decodeURIComponent(body.dataset.raw || ""));
      showToast("Copied");
    });
  });

  root.querySelectorAll("[data-regenerate]").forEach(button => {
    button.addEventListener("click", onRegenerate);
  });
}

export function typingTemplate() {
  return `
    <article class="message assistant" id="typing-message">
      <div class="message-avatar">AI</div>
      <div class="message-content">
        <div class="message-meta"><span class="message-name">Velmora.Ai</span></div>
        <div class="message-body">
          <span class="typing-line">Thinking<span class="typing-dots"><span></span><span></span><span></span></span></span>
        </div>
      </div>
    </article>
  `;
}
