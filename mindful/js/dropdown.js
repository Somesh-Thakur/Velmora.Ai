import { icon } from "./modal.js";

export function customSelectTemplate({ id, value, options, className = "" }) {
  const selected = options.find(option => option.value === value) || options[0];
  return `
    <div class="custom-select ${className}" data-custom-select>
      <input type="hidden" id="${id}" value="${selected.value}" data-select-value>
      <button class="custom-select-trigger" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span data-select-label>${selected.label}</span>
        <span class="custom-select-caret">${icon("chevron")}</span>
      </button>
      <div class="custom-select-menu" role="listbox">
        ${options.map(option => `
          <button class="custom-select-option ${option.value === selected.value ? "active" : ""}" type="button" role="option" data-value="${option.value}" aria-selected="${option.value === selected.value}">
            <span>${option.label}</span>
            ${option.description ? `<small>${option.description}</small>` : ""}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

export function bindCustomSelects(root = document, onChange) {
  root.querySelectorAll("[data-custom-select]").forEach(select => {
    if (select.dataset.bound === "true") return;
    select.dataset.bound = "true";

    const input = select.querySelector("[data-select-value]");
    const label = select.querySelector("[data-select-label]");
    const trigger = select.querySelector(".custom-select-trigger");
    const options = select.querySelectorAll(".custom-select-option");

    trigger.addEventListener("click", event => {
      event.stopPropagation();
      closeOtherSelects(select);
      select.classList.toggle("open");
      trigger.setAttribute("aria-expanded", select.classList.contains("open"));
    });

    options.forEach(option => {
      option.addEventListener("click", event => {
        event.stopPropagation();
        input.value = option.dataset.value;
        label.textContent = option.querySelector("span").textContent;
        options.forEach(item => {
          item.classList.toggle("active", item === option);
          item.setAttribute("aria-selected", item === option);
        });
        closeSelect(select);
        onChange?.({ id: input.id, value: input.value, select });
      });
    });
  });
}

export function closeAllSelects() {
  document.querySelectorAll("[data-custom-select].open").forEach(closeSelect);
}

function closeOtherSelects(current) {
  document.querySelectorAll("[data-custom-select].open").forEach(select => {
    if (select !== current) closeSelect(select);
  });
}

function closeSelect(select) {
  select.classList.remove("open");
  select.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", closeAllSelects);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeAllSelects();
});
