// 轻量 Markdown/frontmatter 解析，避免文章管理依赖后端服务。
const postModules = import.meta.glob('./content/posts/*.md', { query: '?raw', import: 'default', eager: true });
const downloadModules = import.meta.glob('./content/downloads/*.md', { query: '?raw', import: 'default', eager: true });

const slugFromPath = (path) => path.split('/').pop().replace(/\.md$/, '');

const parseValue = (value) => {
  const trimmed = value.trim();
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
  }
  return trimmed.replace(/^['"]|['"]$/g, '');
};

const parseFrontmatter = (raw) => {
  if (!raw.startsWith('---')) return [{}, raw];
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return [{}, raw];
  const meta = raw.slice(3, end).trim().split('\n').reduce((data, line) => {
    const index = line.indexOf(':');
    if (index > -1) data[line.slice(0, index).trim()] = parseValue(line.slice(index + 1));
    return data;
  }, {});
  return [meta, raw.slice(end + 4).trim()];
};

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (text) => escapeHtml(text)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/`(.+?)`/g, '<code>$1</code>');

const markdownToHtml = (markdown) => {
  const lines = markdown.split('\n');
  let html = '';
  let inCode = false;
  let listOpen = false;

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (inCode) html += '</code></pre>';
      else html += '<pre><code>';
      inCode = !inCode;
      return;
    }
    if (inCode) { html += `${escapeHtml(line)}\n`; return; }
    if (line.startsWith('- ')) {
      if (!listOpen) { html += '<ul>'; listOpen = true; }
      html += `<li>${inline(line.slice(2))}</li>`;
      return;
    }
    if (listOpen) { html += '</ul>'; listOpen = false; }
    if (line.startsWith('# ')) html += `<h1>${inline(line.slice(2))}</h1>`;
    else if (line.startsWith('## ')) html += `<h2>${inline(line.slice(3))}</h2>`;
    else if (line.trim()) html += `<p>${inline(line)}</p>`;
  });
  if (listOpen) html += '</ul>';
  if (inCode) html += '</code></pre>';
  return html;
};

const parseMarkdown = ([path, raw]) => {
  const [data, content] = parseFrontmatter(raw);
  return { ...data, slug: slugFromPath(path), html: markdownToHtml(content), raw: content };
};

const byDateDesc = (a, b) => new Date(b.date) - new Date(a.date);

export const posts = Object.entries(postModules).map(parseMarkdown).sort(byDateDesc);
export const downloads = Object.entries(downloadModules).map(parseMarkdown).sort(byDateDesc);
export const getPostBySlug = (slug) => posts.find((post) => post.slug === slug);
