import { useEffect, useState } from 'react';
import { Typewriter } from '../components/Typewriter.jsx';
import { posts } from '../content.js';
import { getDayPart, getSeason, islandTips, profile } from '../lib/island.js';

const pathFor = (path) => `#${path}`;

const formatDate = (date) => new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });

export function HomePage() {
  const [now, setNow] = useState(() => new Date());
  const [bells, setBells] = useState(1200);
  const [tipIndex, setTipIndex] = useState(0);
  const [query, setQuery] = useState('');
  const season = getSeason(now.getMonth());
  const dayPart = getDayPart(now.getHours());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    if (!normalizedQuery) return true;
    return [post.title, post.description, post.author, post.date, post.readingTime, ...(post.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  });

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
          <div className="profile-actions">
            <div className="mini-wallet pop-button" title="点击赚取 100 铃钱" onClick={() => setBells((value) => value + 100)} role="button" tabIndex={0}>
              <span className="wallet-bag">💰</span>
              <strong>{bells.toLocaleString('zh-CN')}</strong>
              <small>Bells</small>
            </div>
            <div className="profile-links">
              {profile.links.map((link) => <a className="pop-button" key={link.label} href={link.href}>{link.label}</a>)}
            </div>
          </div>
        </div>
      </section>

      <section className="notice-board card tilt-card">
        <span>📌</span>
        <div>
          <p className="eyebrow">今日公告</p>
          <p>{profile.notice}</p>
        </div>
      </section>

      <section className="island-dashboard compact-dashboard">
        <button className="info-card card tilt-card interaction-card tip-card" type="button" onClick={() => setTipIndex((index) => (index + 1) % islandTips.length)}>
          <span className="info-icon">💬</span>
          <div>
            <p className="eyebrow">岛民提示</p>
            <h2>今日灵感</h2>
            <p>{islandTips[tipIndex]}</p>
          </div>
        </button>
        <a className="info-card card tilt-card interaction-card pop-button" href={pathFor('/downloads')}>
          <span className="info-icon">🎁</span>
          <div>
            <p className="eyebrow">资源码头</p>
            <h2>去下载页</h2>
            <p>把你的模板、壁纸、软件或作品统一放到资源码头。</p>
          </div>
        </a>
      </section>

      <section className="grid-section">
        <div className="section-title section-title--search">
          <span>🌱</span>
          <h2>文章索引</h2>
          <label className="post-search">
            <span>🔎</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题 / 作者 / 日期 / 标签 / 关键词"
            />
          </label>
        </div>
        <p className="search-count">找到 {filteredPosts.length} 篇文章</p>
        <div className="post-grid">
          {filteredPosts.map((post) => (
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
          {filteredPosts.length === 0 && <p className="empty-result card">没有找到文章，换个关键词试试看。</p>}
        </div>
      </section>
    </>
  );
}
