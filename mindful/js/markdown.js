export function renderMarkdown(input = "") {
  const escaped = escapeHtml(input);
  const withCodeBlocks = escaped.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);
  const lines = withCodeBlocks.split("\n");
  const html = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)/);
    if (bullet) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineFormat(bullet[1])}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (trimmed.startsWith("### ")) {
      html.push(`<p><strong>${inlineFormat(trimmed.slice(4))}</strong></p>`);
    } else if (trimmed.startsWith("## ")) {
      html.push(`<p><strong>${inlineFormat(trimmed.slice(3))}</strong></p>`);
    } else if (trimmed.startsWith("# ")) {
      html.push(`<p><strong>${inlineFormat(trimmed.slice(2))}</strong></p>`);
    } else if (trimmed.startsWith("<pre>")) {
      html.push(trimmed);
    } else {
      html.push(`<p>${inlineFormat(trimmed)}</p>`);
    }
  }

  if (inList) html.push("</ul>");
  return html.join("");
}

function inlineFormat(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
