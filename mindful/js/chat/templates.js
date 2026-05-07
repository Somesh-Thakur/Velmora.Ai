import { icon } from "../modal.js";
import { customSelectTemplate } from "../dropdown.js";
import { modes } from "./modes.js";

export function composerTemplate(mode) {
  return `
    <form class="composer" id="composer-form">
      <label class="sr-only" for="composer-input">Message VelmoraCare.Ai</label>
      <textarea id="composer-input" placeholder="${mode.starter}" rows="3"></textarea>
      <div class="composer-footer">
        ${customSelectTemplate({
    id: "mode-select",
    value: mode.id,
    className: "mode-picker",
    options: modes.map(item => ({ value: item.id, label: item.name, description: item.short }))
  })}
        <span class="composer-hint">Enter to send. Shift and Enter for a new line.</span>
        <button class="send-button" id="send-button" type="submit" aria-label="Send message" disabled>${icon("arrowUp")}</button>
      </div>
    </form>
  `;
}

export function emptyStateTemplate(mode) {
  return `
    <section class="chat-empty">
      <h2>What do you want to talk about?</h2>
      <p>Write the situation in your own words. Use Auto if you want VelmoraCare.Ai to choose the best way to help.</p>
    </section>
  `;
}
