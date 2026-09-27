// The API may return lightweight Markdown emphasis in AI and event copy.
// React escapes all text; only the paired bold markers become elements.
export function renderEmphasis(content: string) {
  return content.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part,
  );
}
