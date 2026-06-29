import { useEffect, useMemo, useRef, useState } from 'react';
import cursorUrl from './assets/cursor/select-cursor.svg';
import { AboutPage } from './pages/AboutPage.jsx';
import { DownloadsPage } from './pages/DownloadsPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { PostPage } from './pages/PostPage.jsx';
import './styles.css';

// 后续把歌曲放进 public/music，再把下面路径替换为你的文件即可。
// 注意：浏览器通常要求用户先点击页面后才允许播放声音，所以这里也提供右下角播放按钮。
const MUSIC_PLAYLIST = ['/music/island-theme.mp3'];

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

function useTiltCards(refreshKey) {
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
  }, [refreshKey]);
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

  useTiltCards(route);

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
      <div className="sun-glow" />
      <audio ref={audioRef} src={MUSIC_PLAYLIST[0]} loop preload="auto" />

      <header className="site-header card tilt-card">
        <a className="brand" href={pathFor('/')}>
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

export default Layout;
