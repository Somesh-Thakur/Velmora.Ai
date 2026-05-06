export function openModal({ title, body, footer = "", onMount }) {
  const root = document.querySelector("#modal-root");
  root.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-label="${title}">
      <section class="modal">
        <header class="modal-head">
          <h2>${title}</h2>
          <button class="icon-button" data-close-modal aria-label="Close">${icon("close")}</button>
        </header>
        <div class="modal-body">${body}</div>
        ${footer ? `<footer class="modal-foot">${footer}</footer>` : ""}
      </section>
    </div>
  `;

  const backdrop = root.querySelector(".modal-backdrop");
  root.querySelector("[data-close-modal]").addEventListener("click", closeModal);
  backdrop.addEventListener("click", event => {
    if (event.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", escapeHandler);
  if (onMount) onMount(root);
}

export function closeModal() {
  document.querySelector("#modal-root").innerHTML = "";
  document.removeEventListener("keydown", escapeHandler);
}

function escapeHandler(event) {
  if (event.key === "Escape") closeModal();
}

export function icon(name) {
  const icons = {
    arrowUp: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    menu: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    close: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    settings: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="1.6"/><path d="M19 12a7.1 7.1 0 0 0-.1-1.1l2-1.5-2-3.4-2.4 1a7.3 7.3 0 0 0-1.9-1.1L14.3 3h-4.6l-.3 2.9c-.7.3-1.3.6-1.9 1.1L5.1 6l-2 3.4 2 1.5A7.1 7.1 0 0 0 5 12c0 .4 0 .8.1 1.1l-2 1.5 2 3.4 2.4-1c.6.5 1.2.8 1.9 1.1l.3 2.9h4.6l.3-2.9c.7-.3 1.3-.6 1.9-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1.1Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
    plus: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    target: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    message: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 6.5h14v9H9l-4 3v-12Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    split: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 6h6v6H5V6ZM13 12h6v6h-6v-6ZM13 5h6M5 18h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    user: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20c1.3-3.2 3.8-5 7.5-5s6.2 1.8 7.5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    eye: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.5 12s3-6 8.5-6 8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="2.8" stroke="currentColor" stroke-width="1.6"/></svg>`,
    coach: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18V8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5V18M7 18v-4h10v4M8 10h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    copy: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 8h10v12H8V8Z" stroke="currentColor" stroke-width="1.6"/><path d="M6 16H4V4h12v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    refresh: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 8a7 7 0 0 0-12.2-2.4L5 7.5M5 4v3.5h3.5M5 16a7 7 0 0 0 12.2 2.4L19 16.5M19 20v-3.5h-3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    chevron: `<svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  return icons[name] || icons.message;
}
