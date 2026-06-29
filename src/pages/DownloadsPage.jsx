import { downloads } from '../content.js';

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

export function DownloadsPage() {
  return (
    <section className="card page-card downloads-page">
      <p className="eyebrow">Resources</p>
      <h1>下载页</h1>
      <p>下载资源同样用 Markdown 管理，资源文件放到 <code>public/downloads</code>，并可用作者、分类、日期、格式等字段做索引。</p>
      <div className="download-list">
        {downloads.map((item) => (
          <article className="download-card tilt-card" key={item.slug}>
            <span>{item.icon || '📦'}</span>
            <div>
              <div className="meta-row">
                <span>🏷️ {item.category || '资源'}</span>
                <span>✍️ {item.author || '岛主'}</span>
                <span>🗓️ {formatDate(item.date)}</span>
                <span>📄 {item.fileType || 'file'}</span>
              </div>
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
