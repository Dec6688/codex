import { useEffect, useState } from 'react';
import { Typewriter } from '../components/Typewriter.jsx';
import { posts } from '../content.js';
import { getDayPart, getSeason, islandTips, profile } from '../lib/island.js';

const pathFor = (path) => `#${path}`;

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

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
  const shellIcons = Array.from({ length: Math.min(shells, 12) }, (_, index) => <span key={index}>🐚</span>);

  return (
    <>
      <section className="hero card hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Animal Crossing Inspired Blog</p>
          <h1>
            <Typewriter speed={55}>欢迎来到柔软、慢生活的个人小岛。</Typewriter>
          </h1>
          <p>文章统一由 Markdown 管理，卡片带轻微 3D 倾斜和岛屿高光，适合记录生活、作品与灵感。</p>
        </div>

        <aside className="clock-widget tilt-card" aria-label="岛屿时间和季节">
          <div className="season-orbit">
            <span className="season-main">{season.icon}</span>
            <span>{season.accent}</span>
            <span>{dayPart.icon}</span>
          </div>
          <p className="eyebrow">Island Time</p>
          <strong>{formattedTime}</strong>
          <p>{dayPart.name} · {dayPart.greeting}</p>
          <p>{season.name} · {season.mood}</p>
        </aside>
      </section>

      <section className="profile-panel card tilt-card">
        <div className="avatar-bubble">{profile.avatar}</div>
        <div>
          <p className="eyebrow">About Me</p>
          <h2>{profile.name}</h2>
          <p className="profile-role">{profile.role}</p>
          <p>{profile.bio}</p>
          <div className="profile-links">
            {profile.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
          </div>
        </div>
      </section>

      <section className="island-dashboard">
        <button className="info-card card tilt-card interaction-card shell-card" type="button" onClick={() => setShells((count) => count + 1)}>
          <span className="info-icon">🏖️</span>
          <div>
            <p className="eyebrow">互动收集</p>
            <h2>{shells} 枚贝壳</h2>
            <p>点击沙滩卡片捡一枚贝壳，收集进度会变成图形。</p>
            <div className="shell-tray" aria-label={`已收集 ${shells} 枚贝壳`}>
              {shellIcons.length > 0 ? shellIcons : <span className="empty-shell">还没有贝壳，点一下试试</span>}
              {shells > 12 && <span className="shell-more">+{shells - 12}</span>}
            </div>
          </div>
        </button>
        <button className="info-card card tilt-card interaction-card tip-card" type="button" onClick={() => setTipIndex((index) => (index + 1) % islandTips.length)}>
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
              <div className="meta-row">
                <span>✍️ {post.author || '岛主'}</span>
                <span>🗓️ {formatDate(post.date)}</span>
                <span>⏱️ {post.readingTime || '约 2 分钟'}</span>
              </div>
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
