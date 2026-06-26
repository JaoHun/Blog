import { codeToHtml } from 'shiki';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function highlightCode(code: string, language = 'text') {
  try {
    return await codeToHtml(code, {
      lang: language || 'text',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });
  } catch {
    return `<pre class="shiki shiki-fallback"><code><span class="line">${escapeHtml(code)}</span></code></pre>`;
  }
}
