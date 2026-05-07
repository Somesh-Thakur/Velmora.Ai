import { closeModal, openModal } from "./modal.js";
import { bindCustomSelects, customSelectTemplate } from "./dropdown.js";
import { storage } from "./storage.js";
import { showToast } from "./toast.js";

const SETTINGS_KEY = "velmora.settings";
const defaults = {
  provider: "auto",
  tone: "clear",
  streaming: true,
  preferredName: "",
  communicationStyle: ""
};

export function getSettings() {
  return { ...defaults, ...storage.get(SETTINGS_KEY, {}), provider: "auto" };
}

export function setSettings(settings) {
  storage.set(SETTINGS_KEY, { ...getSettings(), ...settings });
}

export function openSettings(options = {}) {
  const settings = getSettings();
  openModal({
    title: options.title || "Settings",
    body: `
      <div class="settings-grid">
        <div class="setting-row">
          <div><strong>Default tone</strong><span>Controls how drafts and action plans are phrased.</span></div>
          ${customSelectTemplate({
            id: "tone-select",
            value: settings.tone,
            className: "tone-picker",
            options: [
              { value: "clear", label: "Clear", description: "Calm and direct" },
              { value: "warm", label: "Warm", description: "Softer and reassuring" },
              { value: "firm", label: "Firm", description: "Boundaried and concise" }
            ]
          })}
        </div>
        <div class="field">
          <label for="preferred-name">What should VelmoraCare.Ai call you?</label>
          <input id="preferred-name" value="${escapeAttribute(settings.preferredName)}" placeholder="Your name or nickname">
        </div>
        <div class="field">
          <label for="communication-style">How should VelmoraCare.Ai talk to you?</label>
          <textarea id="communication-style" placeholder="Example: Be direct, gentle, concise, and call out assumptions.">${escapeHtml(settings.communicationStyle)}</textarea>
        </div>
        ${options.extra || ""}
      </div>
    `,
    footer: `<button class="button button-primary" id="save-settings" type="button">Save settings</button>`,
    onMount(root) {
      bindCustomSelects(root, event => {
        if (event.id !== "tone-select") return;
        setSettings({ tone: event.value });
        showToast("Tone updated");
      });
      root.querySelector("#save-settings")?.addEventListener("click", () => {
        setSettings({
          tone: root.querySelector("#tone-select").value,
          preferredName: root.querySelector("#preferred-name").value.trim(),
          communicationStyle: root.querySelector("#communication-style").value.trim()
        });
        showToast("Settings saved");
        closeModal();
      });
      options.onMount?.(root);
    }
  });
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
