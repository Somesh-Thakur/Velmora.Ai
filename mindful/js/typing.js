export async function typeInto(element, text, onStep) {
  element.dataset.raw = "";
  const words = text.split(/(\s+)/);
  for (const word of words) {
    element.dataset.raw += word;
    onStep(element.dataset.raw);
    await delay(word.trim() ? 18 : 4);
  }
}

export function delay(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}
