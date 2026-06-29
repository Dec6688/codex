import { downloads } from '../content.js';

export function DownloadsPage() {
  return (
    <section className="card page-card">
      <p className="eyebrow">Resources</p>
      <h1>下载页</h1>
      <p>下载资源同样用 Markdown 管理，资源文件放到 <code>public/downloads</code>。</p>
      <div className="download-list">
        {downloads.map((item) => (
          <article className="download-card tilt-card" key={item.slug}>
            <span>{item.icon || '📦'}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.file} download>{item.buttonText || '下载'}</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
