import { useEffect, useMemo, useRef, useState } from 'react';
import { Typewriter } from './components/Typewriter.jsx';
import { downloads, getPostBySlug, posts } from './content.js';
import cursorUrl from './assets/cursor/select-cursor.svg';
import './styles.css';

// 后续把歌曲放进 public/music，再把下面路径替换为你的文件即可。
// 注意：浏览器通常要求用户先点击页面后才允许播放声音，所以这里也提供右下角播放按钮。
const MUSIC_PLAYLIST = ['/music/island-theme.mp3'];

const islandTips = [
  '今天适合整理一篇旅行见闻。',
  '别忘了给文章加一个可爱的 cover emoji。',
  '海风提醒你：下载资源也可以写成 Markdown 说明。',
  '路过狸克商店时，顺手记录一个小灵感吧。',
];

const getSeason = (month) => {
  if ([2, 3, 4].includes(month)) return { name: '春季', icon: '🌸', mood: '樱花和嫩芽正在给小岛换新装' };
  if ([5, 6, 7].includes(month)) return { name: '夏季', icon: '🌻', mood: '阳光、海浪和蝉鸣正在营业' };
  if ([8, 9, 10].includes(month)) return { name: '秋季', icon: '🍄', mood: '落叶、蘑菇和温暖灯光很适合写作' };
  return { name: '冬季', icon: '❄️', mood: '雪地脚印和热可可陪你慢慢更新' };
};

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return hash.replace(/^#/, '') || '/';
}

const pathFor = (path) => `#${path}`;

function NavItem({ to, current, children }) {
  const active = current === to || (to === '/' && current === '');
  return <a className={active ? 'active' : ''} href={pathFor(to)}>{children}</a>;
}

function Layout() {
  const route = useHashRoute();
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);
  const page = useMemo(() => {
    if (route.startsWith('/posts/')) return <PostPage slug={route.replace('/posts/', '')} />;
    if (route === '/downloads') return <DownloadsPage />;
    if (route === '/about') return <AboutPage />;
    return <HomePage />;
  }, [route]);

  useEffect(() => {
    const tryPlay = async () => {
      if (!audioRef.current) return;
      try {
        audioRef.current.volume = 0.35;
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        setMusicOn(false);
      }
    };

    tryPlay();
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => window.removeEventListener('pointerdown', tryPlay);
  }, []);


  useEffect(() => {
    const cards = [...document.querySelectorAll('.tilt-card')];
    const handleMove = (event) => {
      const card = event.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 9).toFixed(2)}deg`);
      card.style.setProperty('--shine-x', `${((x + 0.5) * 100).toFixed(0)}%`);
      card.style.setProperty('--shine-y', `${((y + 0.5) * 100).toFixed(0)}%`);
    };
    const reset = (event) => {
      event.currentTarget.style.setProperty('--tilt-x', '0deg');
      event.currentTarget.style.setProperty('--tilt-y', '0deg');
      event.currentTarget.style.setProperty('--shine-x', '50%');
      event.currentTarget.style.setProperty('--shine-y', '30%');
    };

    cards.forEach((card) => {
      card.addEventListener('pointermove', handleMove);
      card.addEventListener('pointerleave', reset);
    });
    return () => cards.forEach((card) => {
      card.removeEventListener('pointermove', handleMove);
      card.removeEventListener('pointerleave', reset);
    });
  }, [page]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setMusicOn(true);
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  };

  return (
    <div className="island-shell" style={{ '--animal-cursor': `url(${cursorUrl}) 12 8, auto` }}>
    <div className="island-shell">
      <div className="sun-glow" />
      <audio ref={audioRef} src={MUSIC_PLAYLIST[0]} loop preload="auto" />

      <header className="site-header card tilt-card">
        <a className="brand" href={pathFor("/")}>
          <span className="brand-mark">🏝️</span>
          <span>我的岛屿博客</span>
        </a>
        <nav>
          <NavItem to="/" current={route}>首页</NavItem>
          <NavItem to="/downloads" current={route}>下载</NavItem>
          <NavItem to="/about" current={route}>关于</NavItem>
        </nav>
      </header>

      <main>{page}</main>

      <button className="music-button tilt-card" type="button" onClick={toggleMusic}>
        {musicOn ? '🎵 音乐播放中' : '🔇 点击播放音乐'}
      </button>
    </div>
  );
}

function HomePage() {
  const [now, setNow] = useState(() => new Date());
  const [shells, setShells] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const season = getSeason(now.getMonth());

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

function PostPage({ slug }) {
  const post = getPostBySlug(slug);

  if (!post) {
    return <section className="card article"><h1>文章不存在</h1><a href={pathFor("/")}>回到首页</a></section>;
  }

  return (
    <article className="card article">
      <a className="back-link" href={pathFor("/")}>← 返回小岛首页</a>
      <p className="date">{post.date}</p>
      <h1>{post.cover} {post.title}</h1>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

function DownloadsPage() {
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

function AboutPage() {
  return (
    <section className="card page-card">
      <p className="eyebrow">About This Island</p>
      <h1>关于页</h1>
      <p>你好！这里是一座温暖的数字小岛。你可以在这里放个人介绍、社交链接、项目经历和联系邮箱。</p>
      <ul className="about-list">
        <li>🌼 风格：动物森友会 / 岛屿 UI</li>
        <li>📝 内容：Markdown 单独管理</li>
        <li>🚀 部署：支持 GitHub Pages</li>
      </ul>
    </section>
  );
}

export default Layout;
