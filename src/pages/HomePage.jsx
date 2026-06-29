import { useEffect, useState } from 'react';
import { Typewriter } from '../components/Typewriter.jsx';
import { posts } from '../content.js';
import { getDayPart, getSeason, islandTips } from '../lib/island.js';

const pathFor = (path) => `#${path}`;

export function HomePage() {
  const [now, setNow] = useState(() => new Date());
  const [shells, setShells] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const season = getSeason(now.getMonth());
  const dayPart = getDayPart(now.getHours());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <>
      <section className="hero card">
        <p className="eyebrow">Animal Crossing Inspired Blog</p>
        <h1>
          <Typewriter speed={55}>欢迎来到柔软、慢生活的个人小岛。</Typewriter>
        </h1>
        <p>文章统一由 Markdown 管理，卡片带轻微 3D 倾斜和岛屿高光，适合记录生活、作品与灵感。</p>
      </section>

      <section className="island-dashboard">
        <article className="info-card card tilt-card">
          <span className="info-icon">{season.icon}</span>
          <div>
            <p className="eyebrow">Island Clock</p>
            <h2>{formattedTime}</h2>
            <p>{dayPart.icon} {dayPart.name} · {dayPart.greeting}。</p>
            <p>现在是{season.name}：{season.mood}。</p>
          </div>
        </article>
        <button className="info-card card tilt-card interaction-card" type="button" onClick={() => setShells((count) => count + 1)}>
          <span className="info-icon">🐚</span>
          <div>
            <p className="eyebrow">互动收集</p>
            <h2>{shells} 枚贝壳</h2>
            <p>点击卡片在沙滩上捡一枚贝壳。</p>
          </div>
        </button>
        <button className="info-card card tilt-card interaction-card" type="button" onClick={() => setTipIndex((index) => (index + 1) % islandTips.length)}>
          <span className="info-icon">💬</span>
          <div>
            <p className="eyebrow">岛民提示</p>
            <h2>今日灵感</h2>
            <p>{islandTips[tipIndex]}</p>
          </div>
        </button>
      </section>

      <section className="grid-section">
        <div className="section-title">
          <span>🌱</span>
          <h2>最新文章</h2>
        </div>
        <div className="post-grid">
          {posts.map((post) => (
            <a className="post-card card tilt-card" key={post.slug} href={pathFor(`/posts/${post.slug}`)}>
              <span className="post-cover">{post.cover || '🍃'}</span>
              <p className="date">{post.date}</p>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <div className="tags">{post.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
