import { getPostBySlug } from '../content.js';

const pathFor = (path) => `#${path}`;

export function PostPage({ slug }) {
  const post = getPostBySlug(slug);

  if (!post) {
    return <section className="card article"><h1>文章不存在</h1><a href={pathFor('/')}>回到首页</a></section>;
  }

  return (
    <article className="card article">
      <a className="back-link" href={pathFor('/')}>← 返回小岛首页</a>
      <p className="date">{post.date}</p>
      <h1>{post.cover} {post.title}</h1>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
