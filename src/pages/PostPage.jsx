import { getPostBySlug } from '../content.js';

const pathFor = (path) => `#${path}`;
const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

export function PostPage({ slug }) {
  const post = getPostBySlug(slug);

  if (!post) {
    return <section className="card article"><h1>文章不存在</h1><a href={pathFor('/')}>回到首页</a></section>;
  }

  return (
    <article className="card article article-shell">
      <a className="back-link" href={pathFor('/')}>← 返回小岛首页</a>
      <div className="article-hero">
        <span className="article-cover">{post.cover || '🍃'}</span>
        <div>
          <p className="eyebrow">Island Post</p>
          <h1>{post.title}</h1>
          <div className="meta-row article-meta">
            <span>✍️ {post.author || '岛主'}</span>
            <span>🗓️ {formatDate(post.date)}</span>
            <span>⏱️ {post.readingTime || '约 2 分钟'}</span>
          </div>
          <div className="tags">{post.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div>
        </div>
      </div>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
