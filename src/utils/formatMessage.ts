/**
 * Minimal, safe formatter for AI replies. Escapes all HTML first (XSS-safe),
 * then renders a tiny markdown subset: **bold** and line breaks.
 * Output is meant for v-html.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatMessage(text: string): string {
  const escaped = escapeHtml(text);
  return escaped
    // **bold** → <strong> (non-greedy, no nested markers)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}
